import { expect, test, type Page } from "@playwright/test";

const SCRIPT = "https://widget.reservationsteps.ru/iframe/library/dist/booking_iframe.js";
const FRAME = "https://reservationsteps.ru/__booking_loading_test";
const BOOKING_URL = "/booking?dfrom=05-11-2026&dto=09-11-2026&adults=3&children=1&room=test-room&promoCode=TEST";

function widgetScript(delay = 0) {
  return `window.BookingIframe = function(options) {
    window.__loadingTestOptions = options;
    this.init = function() {
      setTimeout(function() {
        var frame = document.createElement('iframe');
        frame.src = '${FRAME}';
        document.getElementById(options.html_id).appendChild(frame);
      }, ${delay});
    };
  };`;
}

async function mockFrame(page: Page) {
  await page.route(FRAME, (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><html><body>Варианты размещения</body></html>" }));
}

test("показывает ожидание скрипта и убирает его после загрузки iframe", async ({ page }) => {
  await mockFrame(page);
  let release!: () => void;
  const ready = new Promise<void>((resolve) => { release = resolve; });
  await page.route(SCRIPT, async (route) => {
    await ready;
    await route.fulfill({ contentType: "application/javascript", body: widgetScript() });
  });
  await page.goto(BOOKING_URL);
  try {
    await expect(page.getByRole("status")).toHaveText("Загружаем модуль бронирования…");
  } finally {
    release();
  }
  await expect(page.locator("#bnovo_booking iframe")).toBeVisible();
  await expect(page.getByText("Загружаем модуль бронирования…")).toBeHidden();
  await expect(page.locator("#bnovo_booking iframe")).toHaveAttribute("title", "Онлайн-бронирование Смарт румс");
});

test("при сетевом сбое предлагает контакт и повторную загрузку с теми же параметрами", async ({ page }) => {
  await page.route(SCRIPT, (route) => route.abort());
  await page.goto(BOOKING_URL);
  await expect(page.locator("main").getByRole("alert")).toContainText("Не удалось загрузить модуль бронирования.");
  await expect(page.locator("main").getByRole("link", { name: /^Позвонить:/ })).toHaveAttribute("href", /^tel:\+\d+$/);
  await page.unroute(SCRIPT);
  await mockFrame(page);
  await page.route(SCRIPT, (route) => route.fulfill({ contentType: "application/javascript", body: widgetScript() }));
  await page.getByRole("button", { name: "Обновить страницу" }).click();
  await expect(page.locator("#bnovo_booking iframe")).toBeVisible();
  await expect(page.locator("main").getByRole("alert")).toBeHidden();
  expect(new URL(page.url()).search).toBe(BOOKING_URL.slice(BOOKING_URL.indexOf("?")));
  const options = await page.evaluate(() => (window as unknown as { __loadingTestOptions: Record<string, string> }).__loadingTestOptions);
  expect(options).toMatchObject({ dfrom: "05-11-2026", dto: "09-11-2026", adults: "3", children: "1", rooms: "test-room", promoCode: "TEST" });
});

for (const [name, body] of [
  ["нет конструктора", "/* скрипт загрузился без BookingIframe */"],
  ["инициализация завершилась ошибкой", "window.BookingIframe = function() { this.init = function() { throw new Error('test initialization failure'); }; }"],
]) {
  test(`показывает ошибку, если ${name}`, async ({ page }) => {
    await page.route(SCRIPT, (route) => route.fulfill({ contentType: "application/javascript", body }));
    await page.goto(BOOKING_URL);
    await expect(page.locator("main").getByRole("alert")).toContainText("Не удалось загрузить модуль бронирования.");
    await expect(page.getByRole("button", { name: "Обновить страницу" })).toBeVisible();
  });
}

test("долгое ожидание не мешает iframe догрузиться", async ({ page }) => {
  await page.clock.install();
  await mockFrame(page);
  await page.route(SCRIPT, (route) => route.fulfill({ contentType: "application/javascript", body: widgetScript(25_000) }));
  await page.goto(BOOKING_URL);
  await expect.poll(() => page.evaluate(() => typeof window.BookingIframe)).toBe("function");
  await page.clock.fastForward(20_000);
  await expect(page.getByRole("status")).toContainText("Загрузка занимает больше времени, чем обычно.");
  await expect(page.getByRole("button", { name: "Обновить страницу" })).toBeVisible();
  await page.clock.fastForward(5_000);
  await expect(page.locator("#bnovo_booking iframe")).toBeVisible();
  await expect(page.getByText("Загрузка занимает больше времени, чем обычно.")).toBeHidden();
});

test("повторно встраивает модуль после ухода на главную и возврата", async ({ page }) => {
  await mockFrame(page);
  await page.route(SCRIPT, (route) => route.fulfill({ contentType: "application/javascript", body: widgetScript() }));
  await page.goto(BOOKING_URL);
  await expect(page.locator("#bnovo_booking iframe")).toBeVisible();
  await page.getByRole("link", { name: "Смарт румс — на главную" }).click();
  await page.locator('a[href="/booking"]').first().click();
  await expect(page.locator("#bnovo_booking iframe")).toHaveCount(1);
  await expect(page.getByText("Загружаем модуль бронирования…")).toBeHidden();
});
