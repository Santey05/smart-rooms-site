"use client";

import Script from "next/script";
import { useSearchParams } from "next/navigation";

/**
 * Встроенный модуль бронирования Bnovo.
 *
 * См. CLAUDE.md, раздел 6.1 — параметры и их назначение задокументированы
 * там. Модуль сам показывает актуальные типы номеров, цены, доступность
 * и проводит гостя через оплату — сайт этого не делает и не проверяет
 * (раздел 4.1).
 *
 * ВАЖНО: успешная загрузка этого iframe не является подтверждением
 * работоспособности бронирования — см. раздел 12.3 и 18 CLAUDE.md.
 * Обязателен ручной acceptance-тест перед production.
 */

const BNOVO_HTML_ID = "bnovo_booking";

declare global {
  interface Window {
    BookingIframe?: new (options: Record<string, string>) => { init: () => void };
  }
}

export function BnovoBookingModule() {
  const params = useSearchParams();
  const uid = process.env.NEXT_PUBLIC_BNOVO_UID;

  if (!uid) {
    // Явная ошибка конфигурации лучше, чем молчаливо нерабочий модуль.
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
        Не задана переменная окружения NEXT_PUBLIC_BNOVO_UID. Модуль
        бронирования Bnovo не может быть инициализирован.
      </div>
    );
  }

  return (
    <>
      <div id={BNOVO_HTML_ID} />
      <Script
        src="https://widget.reservationsteps.ru/iframe/library/dist/booking_iframe.js"
        strategy="afterInteractive"
        onReady={() => {
          if (!window.BookingIframe) return;

          new window.BookingIframe({
            html_id: BNOVO_HTML_ID,
            uid,
            lang: "ru",
            width: "auto",
            height: "auto",
            rooms: params.get("room") ?? "", // bnovoRoomTypeId, см. CLAUDE.md 5.2
            dfrom: params.get("dfrom") ?? "",
            dto: params.get("dto") ?? "",
            adults: params.get("adults") ?? "2",
            children: params.get("children") ?? "", // см. CLAUDE.md 6.4
            promoCode: params.get("promoCode") ?? "", // см. CLAUDE.md 6.5
          }).init();
        }}
      />
    </>
  );
}
