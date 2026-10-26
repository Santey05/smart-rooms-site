import { expect, test, type Page } from "@playwright/test";

const MAP_SCRIPT = /https:\/\/api-maps\.yandex\.ru\/2\.1\//;

function mapScript(mode: "normal" | "ready-pending" | "bounds-pending" | "constructor-error" | "bounds-error" | "ready-error" = "normal") {
  return `
    window.__mapConstructed = 0;
    window.ymaps = {
      ready: function(success, error) {
        window.__finishMapReady = success;
        if (${JSON.stringify(mode)} === 'ready-error') { error(); return; }
        if (${JSON.stringify(mode)} !== 'ready-pending') success();
      },
      Map: function(element) {
        window.__mapConstructed++;
        if (${JSON.stringify(mode)} === 'constructor-error') throw new Error('test map construction failure');
        var host = document.getElementById(element);
        this.geoObjects = { add: function(marker) {
          var node = document.createElement('div');
          node.innerHTML = marker.options.iconLayout;
          node.addEventListener('click', function(){ if(marker.handlers.click) marker.handlers.click(); });
          host.appendChild(node);
        }};
        this.setBounds = function() {
          if (${JSON.stringify(mode)} === 'bounds-error') return Promise.reject(new Error('test positioning failure'));
          if (${JSON.stringify(mode)} === 'bounds-pending') return new Promise(function(resolve){ window.__finishMapBounds = resolve; });
          return Promise.resolve();
        };
        this.setCenter = function(coords) { host.dataset.center = JSON.stringify(coords); };
        this.destroy = function() { host.replaceChildren(); };
      },
      Placemark: function(coords, properties, options) {
        this.options = options;
        this.handlers = {};
        var self = this;
        this.events = { add: function(name, callback) { self.handlers[name] = callback; }};
      },
      templateLayoutFactory: { createClass: function(html) { return html; } },
      util: { bounds: { fromPoints: function(points) { return [points[0],points[points.length-1]]; } } }
    };
  `;
}

async function mockMap(page: Page, mode: Parameters<typeof mapScript>[0] = "normal") {
  await page.route(MAP_SCRIPT, (route) => route.fulfill({ contentType: "application/javascript", body: mapScript(mode) }));
}

const explorer = (page: Page) => page.locator("#location");
const map = (page: Page) => page.getByRole("region", { name: "Карта отеля и ближайших мест" });
const pointTabs = (page: Page) => page.getByRole("navigation", { name: "Выбор места" });
const marker = (page: Page, name: string) => map(page).getByRole("button", { name: new RegExp(`^Выбрать место: ${name} —`) });

async function expectCenteredOnRoute(page: Page) {
  const href = await explorer(page).getByRole("link", { name: "Маршрут пешком" }).getAttribute("href");
  const destination = new URL(href!).searchParams.get("rtext")!.split("~")[1].split(",").map(Number);
  await expect(page.locator("#hotel-map")).toHaveAttribute("data-center", JSON.stringify(destination));
}

test("все девять мест показывают свою карточку, без подмены фотографии для Рубинштейна", async ({ page }) => {
  await mockMap(page);
  await page.goto("/");
  const tabs = pointTabs(page).getByRole("button");
  await expect(tabs).toHaveCount(9);
  await pointTabs(page).getByRole("button", { name: "Улица Рубинштейна", exact: true }).click();
  await expect(marker(page, "Улица Рубинштейна")).toHaveAttribute("aria-pressed", "true");
  for (const name of await tabs.allTextContents()) {
    await pointTabs(page).getByRole("button", { name, exact: true }).click();
    await expect(explorer(page).getByRole("heading", { level: 3 })).toHaveText(name);
    await expect(pointTabs(page).getByRole("button", { name, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expectCenteredOnRoute(page);
  }
  await expect(explorer(page).getByText("10 мин пешком от Марата, 30", { exact: true })).toBeVisible();
  await expect(explorer(page).locator("img[alt]")).toHaveCount(0);
  await expect(explorer(page).getByRole("link", { name: /^Фото:/ })).toHaveCount(0);
  await pointTabs(page).getByRole("button", { name: "Аничков мост", exact: true }).click();
  await expect(explorer(page).getByRole("img", { name: "Аничков мост со скульптурами Петра Клодта" })).toBeVisible();
  await expect(explorer(page).getByRole("link", { name: /^Фото:/ })).toContainText("CC BY-SA 4.0");
});

test("клик и клавиатура на маркерах меняют карточку и выделение", async ({ page }) => {
  await mockMap(page);
  await page.goto("/");
  await expect(marker(page, "Невский проспект")).toHaveAttribute("aria-pressed", "true");
  await marker(page, "Улица Рубинштейна").click();
  await expect(explorer(page).getByRole("heading", { level: 3 })).toHaveText("Улица Рубинштейна");
  await expect(marker(page, "Улица Рубинштейна")).toHaveAttribute("aria-pressed", "true");
  await expect(marker(page, "Невский проспект")).toHaveAttribute("aria-pressed", "false");
  await marker(page, "Галерея").focus();
  await page.keyboard.press("Enter");
  await expect(explorer(page).getByRole("heading", { level: 3 })).toHaveText("Галерея");
  await marker(page, "Невский проспект").focus();
  await page.keyboard.press("Space");
  await expect(explorer(page).getByRole("heading", { level: 3 })).toHaveText("Невский проспект");
  await expectCenteredOnRoute(page);
});

for (const mode of ["ready-pending", "bounds-pending"] as const) {
  test(`сохраняет выбор во время загрузки карты: ${mode}`, async ({ page }) => {
    await mockMap(page, mode);
    await page.goto("/");
    const callback = mode === "ready-pending" ? "__finishMapReady" : "__finishMapBounds";
    await page.waitForFunction((key) => typeof (window as unknown as Record<string, unknown>)[key] === "function", callback);
    await pointTabs(page).getByRole("button", { name: "Улица Рубинштейна", exact: true }).click();
    await page.evaluate((key) => ((window as unknown as Record<string, () => void>)[key])(), callback);
    await expect(marker(page, "Улица Рубинштейна")).toHaveAttribute("aria-pressed", "true");
    await expect(explorer(page).getByRole("heading", { level: 3 })).toHaveText("Улица Рубинштейна");
    await expectCenteredOnRoute(page);
  });
}

test("при сетевом сбое карты остаются карточки и правильный внешний маршрут", async ({ page }) => {
  await page.route(MAP_SCRIPT, (route) => route.abort());
  await page.goto("/");
  await expect(map(page).getByText("Не удалось загрузить карту")).toBeVisible();
  await pointTabs(page).getByRole("button", { name: "Галерея", exact: true }).click();
  await expect(explorer(page).getByRole("heading", { level: 3 })).toHaveText("Галерея");
  const cardHref = await explorer(page).getByRole("link", { name: "Маршрут пешком" }).getAttribute("href");
  await expect(map(page).getByRole("link", { name: "Открыть Яндекс.Карты" })).toHaveAttribute("href", cardHref!);
});

for (const mode of ["constructor-error", "bounds-error", "ready-error"] as const) {
  test(`показывает запасной вариант при отказе API: ${mode}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await mockMap(page, mode);
    await page.goto("/");
    await expect(map(page).getByText("Не удалось загрузить карту")).toBeVisible();
    await expect(map(page).getByRole("link", { name: "Открыть Яндекс.Карты" })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("после долгого ожидания карта может догрузиться и сохранить выбор", async ({ page }) => {
  await page.clock.install();
  await mockMap(page, "ready-pending");
  await page.goto("/");
  await page.waitForFunction(() => typeof (window as unknown as Record<string, unknown>).__finishMapReady === "function");
  await page.clock.fastForward(20_000);
  await expect(map(page).getByText("Не удалось загрузить карту")).toBeVisible();
  await pointTabs(page).getByRole("button", { name: "Аничков мост", exact: true }).click();
  await page.evaluate(() => (window as unknown as { __finishMapReady: () => void }).__finishMapReady());
  await expect(map(page).getByText("Не удалось загрузить карту")).toBeHidden();
  await expect(marker(page, "Аничков мост")).toHaveAttribute("aria-pressed", "true");
  await expectCenteredOnRoute(page);
});

test("после ухода со страницы отложенная загрузка не создаёт карту", async ({ page }) => {
  await mockMap(page, "ready-pending");
  await page.goto("/");
  await page.waitForFunction(() => typeof (window as unknown as Record<string, unknown>).__finishMapReady === "function");
  await page.getByRole("navigation", { name: "Основная навигация" }).getByRole("link", { name: "Контакты", exact: true }).click();
  await expect(page).toHaveURL(/\/contacts$/);
  await expect(page.locator("#hotel-map")).toHaveCount(0);
  await page.evaluate(() => (window as unknown as { __finishMapReady: () => void }).__finishMapReady());
  expect(await page.evaluate(() => (window as unknown as { __mapConstructed: number }).__mapConstructed)).toBe(0);
  await expect(page.locator("#hotel-map")).toHaveCount(0);
});

test("карточки всех мест помещаются на узком экране даже без карты", async ({ page }) => {
  await page.route(MAP_SCRIPT, (route) => route.abort());
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  for (const name of await pointTabs(page).getByRole("button").allTextContents()) {
    await pointTabs(page).getByRole("button", { name, exact: true }).click();
    await expect(explorer(page).getByRole("heading", { level: 3 })).toHaveText(name);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  }
});