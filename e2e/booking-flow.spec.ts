import { expect, test } from "@playwright/test";

import { formatBnovoDate } from "../src/lib/booking";

/**
 * Сценарий из CLAUDE.md, раздела 12.1:
 *
 *   Открыть главную → выбрать даты в форме поиска → перейти на /booking
 *   → убедиться, что параметры (даты, adults, children) корректно
 *   переданы в модуль → убедиться, что iframe модуля загрузился и виден
 *
 * Полный сценарий оплаты внутри самого iframe намеренно не тестируется —
 * это чужой виджет вне контроля этого проекта (раздел 12.1).
 */

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

test("поиск на главной передаёт даты и гостей в /booking и в модуль Bnovo", async ({ page }) => {
  const today = new Date();
  const checkIn = addDays(today, 5);
  const checkOut = addDays(today, 9);

  // Перехватываем window.BookingIframe ещё ДО того, как его выставит
  // настоящий скрипт Bnovo — чтобы увидеть параметры, с которыми модуль
  // реально инициализируется, а не только то, что оказалось в URL.
  // Реальный конструктор всё равно вызывается (через `return new Real(...)`),
  // так что настоящий iframe дальше по тесту тоже должен появиться по-честному.
  await page.addInitScript(() => {
    let RealCtor: (new (options: unknown) => unknown) | undefined;
    Object.defineProperty(window, "BookingIframe", {
      configurable: true,
      get() {
        if (!RealCtor) return undefined;
        return function Wrapped(this: unknown, options: unknown) {
          (window as unknown as Record<string, unknown>).__bnovoCapturedOptions = options;
          return new RealCtor!(options);
        };
      },
      set(ctor: new (options: unknown) => unknown) {
        RealCtor = ctor;
      },
    });
  });

  await page.goto("/");

  await page.getByRole("button", { name: /^Заезд/ }).click();
  await page
    .locator(`[data-day="${isoDate(checkIn)}"] button`)
    .first()
    .click();
  await page
    .locator(`[data-day="${isoDate(checkOut)}"] button`)
    .first()
    .click();
  await page.getByRole("dialog", { name: "Выбор дат" }).getByRole("button", { name: "Готово" }).click();

  await page.getByRole("button", { name: /^Гости/ }).click();
  await page.getByRole("button", { name: "Увеличить: Взрослые" }).click();
  await page.getByRole("button", { name: "Увеличить: Взрослые" }).click();
  await page.getByRole("button", { name: "Увеличить: Дети" }).click();
  await page.getByRole("dialog", { name: "Выбор гостей" }).getByRole("button", { name: "Готово" }).click();

  await page.getByRole("button", { name: "Забронировать" }).click();

  // 1. Параметры дошли до URL /booking.
  await expect(page).toHaveURL(/\/booking\?/);
  const url = new URL(page.url());
  const expectedDfrom = formatBnovoDate(checkIn);
  const expectedDto = formatBnovoDate(checkOut);
  expect(url.searchParams.get("dfrom")).toBe(expectedDfrom);
  expect(url.searchParams.get("dto")).toBe(expectedDto);
  expect(url.searchParams.get("adults")).toBe("3");
  expect(url.searchParams.get("children")).toBe("1");

  // 2. Те же параметры реально дошли до инициализации модуля Bnovo.
  await expect
    .poll(
      () =>
        page.evaluate(
          () => (window as unknown as Record<string, unknown>).__bnovoCapturedOptions,
        ),
      { timeout: 15_000 },
    )
    .toMatchObject({
      dfrom: expectedDfrom,
      dto: expectedDto,
      adults: "3",
      children: "1",
    });

  // 3. Модуль не просто "инициализирован" — его iframe реально виден
  // (раздел 18 CLAUDE.md: загрузка iframe сама по себе не подтверждает
  // работоспособность бронирования, но то, что он хотя бы появился на
  // странице, обязана показать эта проверка).
  await expect(page.locator("#bnovo_booking iframe").first()).toBeVisible({ timeout: 20_000 });
});
