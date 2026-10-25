import { expect, test, type Page } from "@playwright/test";

const TODAY = new Date(2026, 9, 26, 12);
const day = (page: Page, date: string) => page.locator(`[data-day="${date}"] button`).first();

for (const width of [1280, 390]) {
  test.describe(`форма поиска, ширина ${width}`, () => {
    test.use({ viewport: { width, height: 900 } });
    test.beforeEach(async ({ page }) => {
      await page.clock.install({ time: TODAY });
      await page.goto("/");
      await expect(page.getByRole("button", { name: /^Заезд:/ })).toHaveAccessibleName(/27 октября 2026/);
    });

    test("меняет только выезд и сохраняет заезд в параметрах поиска", async ({ page }) => {
      await page.getByRole("button", { name: /^Выезд:/ }).click();
      const dialog = page.getByRole("dialog", { name: "Выбор дат" });
      await expect(dialog).toContainText("Выберите дату выезда");
      await expect(day(page, "2026-10-27")).toBeDisabled();
      await day(page, "2026-10-29").click();
      await dialog.getByRole("button", { name: "Готово" }).click();
      await expect(page.getByRole("button", { name: /^Выезд:/ })).toBeFocused();
      await expect(page.getByRole("button", { name: /^Заезд:/ })).toHaveAccessibleName(/27 октября/);
      await page.getByRole("button", { name: "Забронировать", exact: true }).click();
      await expect(page).toHaveURL(/\/booking\?/);
      const params = new URL(page.url()).searchParams;
      expect(params.get("dfrom")).toBe("27-10-2026");
      expect(params.get("dto")).toBe("29-10-2026");
      expect(params.get("adults")).toBe("1");
      expect(params.has("children")).toBe(false);
    });

    test("после нового заезда просит выезд и не принимает ту же или более раннюю дату", async ({ page }) => {
      await page.getByRole("button", { name: /^Заезд:/ }).click();
      await day(page, "2026-10-29").click();
      const dialog = page.getByRole("dialog", { name: "Выбор дат" });
      await expect(dialog).toContainText("Выберите дату выезда");
      await expect(dialog.getByRole("button", { name: "Готово" })).toBeDisabled();
      await expect(day(page, "2026-10-28")).toBeDisabled();
      await expect(day(page, "2026-10-29")).toBeDisabled();
      await day(page, "2026-10-30").click();
      await expect(dialog.getByRole("button", { name: "Готово" })).toBeEnabled();
      await dialog.getByRole("button", { name: "Готово" }).click();
      await expect(page.getByRole("button", { name: /^Заезд:/ })).toBeFocused();
      await expect(page.getByRole("button", { name: /^Заезд:/ })).toHaveAccessibleName(/29 октября/);
      await expect(page.getByRole("button", { name: /^Выезд:/ })).toHaveAccessibleName(/30 октября/);
    });

    test("после заезда в последний день месяца открывает следующий месяц для выезда", async ({ page }) => {
      await page.getByRole("button", { name: /^Заезд:/ }).click();
      await day(page, "2026-10-31").click();
      await expect(day(page, "2026-11-01")).toBeVisible();
      await expect(day(page, "2026-11-01")).toBeFocused();
      await page.keyboard.press("Enter");
      await page.getByRole("dialog", { name: "Выбор дат" }).getByRole("button", { name: "Готово" }).click();
      await expect(page.getByRole("button", { name: /^Заезд:/ })).toHaveAccessibleName(/31 октября/);
      await expect(page.getByRole("button", { name: /^Выезд:/ })).toHaveAccessibleName(/1 ноября/);
    });

    test("переводит фокус в панели, возвращает по Escape и выпускает по Tab", async ({ page }) => {
      const checkout = page.getByRole("button", { name: /^Выезд:/ });
      await checkout.focus();
      await page.keyboard.press("Enter");
      await expect(day(page, "2026-10-28")).toBeFocused();
      await page.keyboard.press("ArrowRight");
      await expect(day(page, "2026-10-29")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(checkout).toBeFocused();
      await expect(page.getByRole("dialog", { name: "Выбор дат" })).toBeHidden();

      const guests = page.getByRole("button", { name: /^Гости:/ });
      await guests.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("button", { name: "Увеличить: Взрослые" })).toBeFocused();
      await page.keyboard.press("Enter");
      await page.getByRole("dialog", { name: "Выбор гостей" }).getByRole("button", { name: "Готово" }).click();
      await expect(guests).toBeFocused();
      await expect(guests).toHaveAccessibleName("Гости: 2 взрослых");
      await page.keyboard.press("Enter");
      await page.getByRole("dialog", { name: "Выбор гостей" }).getByRole("button", { name: "Готово" }).focus();
      await page.keyboard.press("Tab");
      await expect(page.getByRole("dialog", { name: "Выбор гостей" })).toBeHidden();
      await expect(page.getByRole("button", { name: "Забронировать", exact: true })).toBeFocused();
    });
  });
}

test("закрывает панель при касании снаружи", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 900 }, hasTouch: true });
  try {
    await page.goto("/");
    await page.getByRole("button", { name: /^Гости:/ }).tap();
    await expect(page.getByRole("dialog", { name: "Выбор гостей" })).toBeVisible();
    await page.locator("h1").tap();
    await expect(page.getByRole("dialog", { name: "Выбор гостей" })).toBeHidden();
  } finally {
    await page.close();
  }
});

// Проверяем саму панель: общая адаптивность главной — следующий этап плана.
test("календарь виден целиком и не выходит за экран на ширинах 320 и 640", async ({ page }) => {
  for (const width of [320, 640]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: /^Выезд:/ }).click();
    const box = await page.getByRole("dialog", { name: "Выбор дат" }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(830);
    const panel = page.getByRole("dialog", { name: "Выбор дат" });
    expect(await panel.evaluate((element) => {
      const r = element.getBoundingClientRect();
      return element.contains(document.elementFromPoint(r.x + 30, r.y + 130));
    })).toBe(true);
  }
});
