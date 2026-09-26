/**
 * Утилиты для передачи параметров поиска в модуль бронирования Bnovo.
 *
 * Важно (см. CLAUDE.md, раздел 4.1): этот модуль НИЧЕГО не проверяет
 * и не рассчитывает — он только форматирует значения, введённые гостем,
 * в параметры, которые понимает модуль Bnovo (раздел 6.1). Доступность,
 * цена и вместимость номеров проверяются исключительно внутри модуля.
 */

export interface BookingSearchValues {
  /** Дата заезда */
  checkIn: Date;
  /** Дата выезда */
  checkOut: Date;
  /** Количество взрослых гостей */
  adults: number;
  /** Количество детей — см. CLAUDE.md 6.4: не суммировать с adults */
  children?: number;
  /** ID типа номера в Bnovo (bnovoRoomTypeId) — опционально, см. CLAUDE.md 5.2 */
  room?: string;
  /** Промокод — см. CLAUDE.md 6.5, в MVP не используется */
  promoCode?: string;
}

/** Формат даты, который ожидает модуль Bnovo: DD-MM-YYYY (см. CLAUDE.md 6.1) */
export function formatBnovoDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Строит query-строку для страницы /booking из значений формы поиска.
 * Ничего не валидирует сверх базовой проверки наличия дат — вся
 * содержательная проверка (доступность, вместимость) происходит в модуле.
 */
export function buildBookingSearchParams(values: BookingSearchValues): URLSearchParams {
  const params = new URLSearchParams({
    dfrom: formatBnovoDate(values.checkIn),
    dto: formatBnovoDate(values.checkOut),
    adults: String(values.adults),
  });

  if (values.children && values.children > 0) {
    params.set("children", String(values.children));
  }
  if (values.room) {
    params.set("room", values.room);
  }
  if (values.promoCode) {
    params.set("promoCode", values.promoCode);
  }

  return params;
}

export function buildBookingHref(values: BookingSearchValues): string {
  return `/booking?${buildBookingSearchParams(values).toString()}`;
}
