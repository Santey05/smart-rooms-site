import type { Metadata } from "next";
import { Suspense } from "react";

import { BnovoBookingModule } from "@/components/bnovo-booking-module";

export const metadata: Metadata = {
  title: "Бронирование — Смарт румс",
  description: "Выберите номер и даты — бронирование и оплата онлайн.",
  robots: { index: false, follow: false },
};

// useSearchParams в BnovoBookingModule требует Suspense-границы для
// корректной статической сборки — см. документацию Next.js (useSearchParams).
export default function BookingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        Бронирование
      </h1>
      <Suspense fallback={<BookingModuleFallback />}>
        <BnovoBookingModule />
      </Suspense>
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
