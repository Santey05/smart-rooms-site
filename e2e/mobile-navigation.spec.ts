import { expect, test } from "@playwright/test";

for (const width of [320, 390]) {
  test(`мобильное меню на главной и внутренней странице, ширина ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/contacts"]) {
      await page.goto(route);
      const nav = page.getByRole("navigation", { name: "Основная навигация", exact: true });
      await expect(nav).toHaveCount(1);
      const trigger = nav.getByRole("button", { name: "Открыть меню" });
      await expect(trigger).toBeVisible();
      await expect(nav.getByRole("link", { name: /^Позвонить:/ })).toHaveAttribute("href", /^tel:\+\d+$/);
      await trigger.focus();
      await page.keyboard.press("Enter");
      const menu = nav.getByRole("dialog", { name: "Меню сайта" });
      await expect(menu.getByRole("link", { name: "Номера", exact: true })).toBeFocused();
      await expect(menu.getByRole("link", { name: "Петербург рядом", exact: true })).toBeVisible();
      await expect(menu.getByRole("link", { name: "Правила проживания", exact: true })).toBeVisible();
      const box = await menu.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press("Escape");
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await menu.getByRole("link", { name: "Контакты", exact: true }).click();
      await expect(page).toHaveURL(/\/contacts$/);
      await expect(page.getByRole("dialog", { name: "Меню сайта" })).toBeHidden();
    }
  });
}

test("переход к разделу главной закрывает меню", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.getByRole("dialog", { name: "Меню сайта" }).getByRole("link", { name: "Номера", exact: true }).click();
  await expect(page).toHaveURL(/\/#rooms$/);
  await expect(page.getByRole("dialog", { name: "Меню сайта" })).toBeHidden();
  await expect(page.locator("#rooms")).toBeInViewport();
});

test("касание снаружи закрывает меню", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true });
  try {
    await page.goto("/");
    await page.getByRole("button", { name: "Открыть меню" }).tap();
    await page.getByRole("button", { name: /^Гости:/ }).tap();
    await expect(page.getByRole("dialog", { name: "Меню сайта" })).toBeHidden();
    await expect(page.getByRole("dialog", { name: "Выбор гостей" })).toBeVisible();
  } finally {
    await page.close();
  }
});

test("после расширения экрана меню закрыто и при возврате на телефон", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole("dialog", { name: "Меню сайта" })).toBeHidden();
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(page.getByRole("button", { name: "Открыть меню" })).toHaveAttribute("aria-expanded", "false");
});

test("нижняя кнопка ведёт к форме и не закрывает форму или футер", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  const bar = page.getByRole("complementary", { name: "Быстрое бронирование" });
  const form = page.locator("#hero-card");
  await form.scrollIntoViewIfNeeded();
  await expect(bar).toBeHidden();
  await page.locator("#rooms").scrollIntoViewIfNeeded();
  await expect(bar).toBeVisible();
  await bar.getByRole("link", { name: "Забронировать" }).click();
  await expect(form).toBeInViewport();
  await expect(form).toBeFocused();
  await expect(bar).toBeHidden();
  await page.locator("footer").evaluate((footer) => footer.scrollIntoView({ block: "end", behavior: "instant" }));
  await expect(bar).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Служебные страницы" }).getByRole("link", { name: "Политика конфиденциальности" })).toBeInViewport();
});

for (const width of [320, 640, 768, 1280]) {
  test(`страницы не расширяют экран по горизонтали, ширина ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    // Здесь проверяем оболочку страницы; интеграцию Bnovo покрывает booking-flow.
    await page.route("**/booking_iframe.js", (route) => route.fulfill({ contentType: "application/javascript", body: "window.BookingIframe=function(){this.init=function(){}}" }));
    for (const route of ["/", "/contacts", "/rules", "/privacy", "/booking"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(width);
      const nav = page.getByRole("navigation", { name: "Служебные страницы" });
      const box = await nav.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
  });
}
