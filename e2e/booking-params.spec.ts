import { expect, test } from "@playwright/test";

import { buildBookingSearchParams, formatBnovoDate, parseBnovoChildren } from "../src/lib/booking";

/**
 * Юнит-проверка формирования query-параметров /booking (CLAUDE.md,
 * раздел 12.2) — чистая функция, браузер не нужен.
 */
test.describe("buildBookingSearchParams", () => {
  test("dfrom/dto в формате DD-MM-YYYY, adults всегда присутствует", () => {
    const params = buildBookingSearchParams({
      checkIn: new Date(2026, 9, 5),
      checkOut: new Date(2026, 9, 9),
      adults: 2,
    });

    expect(params.get("dfrom")).toBe("05-10-2026");
    expect(params.get("dto")).toBe("09-10-2026");
    expect(params.get("adults")).toBe("2");
    expect(params.has("children")).toBe(false);
    expect(params.has("room")).toBe(false);
    expect(params.has("promoCode")).toBe(false);
  });

  test("children — отдельный параметр, не суммируется с adults (CLAUDE.md 6.4)", () => {
    const params = buildBookingSearchParams({
      checkIn: new Date(2026, 9, 5),
      checkOut: new Date(2026, 9, 9),
      adults: 2,
      children: [6, 17],
    });

    expect(params.get("adults")).toBe("2");
    expect(params.get("children")).toBe("[6,17]");
  });

  test("пустой список детей не попадает в параметры", () => {
    const params = buildBookingSearchParams({
      checkIn: new Date(2026, 9, 5),
      checkOut: new Date(2026, 9, 9),
      adults: 2,
      children: [],
    });

    expect(params.has("children")).toBe(false);
  });

  test("room и promoCode передаются, когда заданы", () => {
    const params = buildBookingSearchParams({
      checkIn: new Date(2026, 9, 5),
      checkOut: new Date(2026, 9, 9),
      adults: 1,
      room: "room-type-id",
      promoCode: "SUMMER",
    });

    expect(params.get("room")).toBe("room-type-id");
    expect(params.get("promoCode")).toBe("SUMMER");
  });

  test("formatBnovoDate дополняет день/месяц нулём", () => {
    expect(formatBnovoDate(new Date(2026, 0, 1))).toBe("01-01-2026");
  });
});


test.describe("формат возрастов для Bnovo", () => {
  test("принимает возраста 6 и 17 лет и пустой список", () => {
    expect(parseBnovoChildren("[6,17]")).toEqual([6, 17]);
    expect(parseBnovoChildren("[]")).toEqual([]);
    expect(parseBnovoChildren(null)).toEqual([]);
  });

  test("отклоняет количество вместо возрастов и некорректный массив", () => {
    for (const value of ["1", "2", "null", "{}", "not-json", '["6"]', "[null]", "[5]", "[18]", "[6.5]"]) {
      expect(parseBnovoChildren(value)).toBeNull();
    }
  });
});
