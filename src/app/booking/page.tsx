import type { Metadata } from "next";
import { Suspense } from "react";

import { BnovoBookingModule } from "@/components/bnovo-booking-module";

export const metadata: Metadata = {
  title: "Бронирование",
  description: "Выберите номер и даты — бронирование и оплата онлайн.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/booking" },
};

// useSearchParams в BnovoBookingModule требует Suspense-границы для
// корректной статической сборки — см. документацию Next.js (useSearchParams).
//
// Сам модуль Bnovo (iframe с чужого домена) нашим CSS не перекрасить —
// только обрамление вокруг него на этой странице. Цветовую схему самого
// модуля можно настроить отдельно в личном кабинете Bnovo (Управление
// продажами → Каналы продаж → Модуль онлайн-бронирования → Настроить →
// вкладка «Оформление») — переустанавливать модуль на сайте после этого
// не нужно.
export default function BookingPage() {
  return (
    <main className="mx-auto max-w-6xl px-2 py-8 sm:px-3 sm:py-12 md:px-6 lg:px-12">
      <div className="overflow-hidden rounded-[24px] border border-border">
        <div className="bg-neva px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="text-xs font-semibold tracking-[0.18em] text-lantern uppercase">Смарт румс</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Бронирование</h1>
        </div>

        <div className="bg-white p-3 sm:p-6">
          <Suspense fallback={<BookingModuleFallback />}>
            <BnovoBookingModule />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function BookingModuleFallback() {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
      Загружаем модуль бронирования…
    </div>
  );
}
