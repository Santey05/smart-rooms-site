import type { Metadata } from "next";
import Link from "next/link";

import { BookingSearchForm } from "@/components/booking-search-form";
import { ContactList } from "@/components/contact-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Смарт румс — мини-отель",
  description:
    "Уютные номера в центре города. Проверьте даты и забронируйте номер онлайн — актуальные цены и наличие показывает наша система бронирования.",
};

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-12 sm:py-16">
      {/* Hero */}
      <section className="flex flex-col gap-6 text-center sm:gap-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Смарт румс
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground sm:text-lg">
          Небольшой отель в центре города. Проверьте даты, чтобы увидеть
          актуальные номера, цены и условия — точную стоимость на выбранные
          даты покажет наша система бронирования.
        </p>
        <div className="mx-auto w-full max-w-3xl">
          <BookingSearchForm />
        </div>
      </section>

      {/* Номера — общий блок без карточек/цен, см. CLAUDE.md раздел 5 */}
      <section
        id="rooms"
        className="grid gap-8 rounded-xl border bg-card p-6 shadow-sm sm:grid-cols-2 sm:items-center sm:p-10"
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Номера
          </h2>
          <p className="text-muted-foreground">
            У нас несколько типов номеров — от уютных двухместных до
            просторных семейных, рассчитанных на большую компанию. Актуальные
            фото, описания, цены и наличие на конкретные даты вы увидите на
            странице бронирования.
          </p>
          <div>
            <Button asChild size="lg">
              <Link href="/booking">Смотреть номера и цены</Link>
            </Button>
          </div>
        </div>
        <div className="aspect-video rounded-lg bg-muted" aria-hidden />
      </section>

      {/* Контакты — данные из src/content/site.ts */}
      <section id="contacts" className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Контакты
        </h2>
        <ContactList />
      </section>
    </main>
  );
}
