import { expect, test } from "@playwright/test";

for (const width of [1280, 390]) {
  test(`возраст каждого ребёнка обязателен и передаётся массивом, ширина ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: /^Гости:/ }).click();
    const dialog = page.getByRole("dialog", { name: "Выбор гостей" });
    const done = dialog.getByRole("button", { name: "Готово" });
    await page.getByRole("button", { name: "Увеличить: Дети" }).click();
    await page.getByRole("button", { name: "Увеличить: Дети" }).click();
    const first = page.getByRole("combobox", { name: "Возраст ребёнка 1" });
    const second = page.getByRole("combobox", { name: "Возраст ребёнка 2" });
    await expect(first).toHaveValue("");
    await expect(second).toHaveValue("");
    await expect(done).toBeDisabled();
    await expect(first.locator("option:not([disabled])")).toHaveCount(12);
    await expect(first.locator("option:not([disabled])").first()).toHaveAttribute("value", "6");
    await expect(first.locator("option:not([disabled])").last()).toHaveAttribute("value", "17");
    await first.selectOption("6");
    await expect(done).toBeDisabled();
    await second.selectOption("17");
    await expect(done).toBeEnabled();
    // Удаление последнего ребёнка не меняет возраст оставшегося.
    await page.getByRole("button", { name: "Уменьшить: Дети" }).click();
    await expect(first).toHaveValue("6");
    await expect(second).toBeHidden();
    await page.getByRole("button", { name: "Увеличить: Дети" }).click();
    await expect(second).toHaveValue("");
    await second.selectOption("17");
    await done.click();
    await expect(page.getByRole("button", { name: /^Гости:/ })).toHaveAccessibleName("Гости: 1 взрослый, 2 ребёнка");
    await page.getByRole("button", { name: "Забронировать", exact: true }).click();
    await expect(page).toHaveURL(/\/booking\?/);
    const params = new URL(page.url()).searchParams;
    expect(params.get("adults")).toBe("1");
    expect(JSON.parse(params.get("children")!)).toEqual([6, 17]);
  });
}

test("ссылка с количеством детей просит выбрать возраст и не отправляет неверные данные Bnovo", async ({ page }) => {
  let scriptRequested = false;
  page.on("request", (request) => {
    if (request.url().includes("booking_iframe.js")) scriptRequested = true;
  });
  await page.goto("/booking?adults=1&children=1");
  await expect(page.locator("main").getByRole("alert")).toContainText("Укажите возраст каждого ребёнка");
  await expect(page.getByRole("link", { name: "Выбрать возраст детей" })).toHaveAttribute("href", "/#hero-card");
  await expect(page.locator("#bnovo_booking iframe")).toHaveCount(0);
  expect(scriptRequested).toBe(false);
});
