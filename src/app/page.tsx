import { BedDouble, MapPin, Star, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BookingSearchForm } from "@/components/booking-search-form";
import { BrushUnderline, LogoSign } from "@/components/brand/logo";
import {
  HeroArt,
  PhotoPlaceholder,
  SketchArt,
} from "@/components/brand/petersburg-art";
import { ContactList } from "@/components/contact-list";
import { Button } from "@/components/ui/button";
import { hotel } from "@/content/site";

export const metadata: Metadata = {
  title: "Смарт Румс — мини-отель в Санкт-Петербурге",
  description:
    "Уютный и недорогой мини-отель в центре Санкт-Петербурга, ул. Марата, 30. Проверьте даты и забронируйте номер онлайн — актуальные цены и наличие показывает система бронирования.",
};

const BENEFITS = [
  {
    icon: MapPin,
    title: "Центр города",
    text: `${hotel.address?.replace("Санкт-Петербург, ", "") ?? "Центр города"} — всё рядом: ${hotel.metroNote?.toLowerCase() ?? "метро"}, кафе, достопримечательности.`,
  },
  {
    icon: Wallet,
    title: "Доступные цены",
    text: "Комфортный отдых без переплат.",
  },
  {
    icon: BedDouble,
    title: "Уютные номера",
    text: "Всё необходимое для короткой и долгой поездки.",
  },
  {
    icon: Star,
    title: "Всё для путешественника",
    text: "Удобное заселение, дружелюбный персонал, Wi-Fi.",
  },
] as const;

export default function HomePage() {
  const mapHref = `https://yandex.ru/maps/?text=${encodeURIComponent(hotel.address ?? "")}`;

  return (
    <main>
      {/* Hero */}
      <section className="relative z-10 flex min-h-[46rem] flex-col justify-end bg-ink text-white">
        {/* overflow-hidden только у слоя с иллюстрацией: панели формы поиска
            раскрываются вниз и должны выходить за нижний край hero */}
        <div className="absolute inset-0 overflow-hidden">
          <HeroArt />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/30" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center px-4 pb-8 pt-32">
          <LogoSign className="mr-10 hidden shrink-0 -rotate-2 lg:block" />
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center lg:mr-auto lg:ml-0 lg:items-start lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/85">
              Санкт-Петербург
            </p>
            <h1 className="font-hand text-6xl font-bold leading-[0.95] sm:text-8xl">
              Ближе, чем
              <br />
              кажется
            </h1>
            <BrushUnderline className="h-3 w-56 sm:w-72" />
            <p className="text-lg text-white/90 sm:text-xl">
              Уютный и недорогой мини-отель
              <br />в самом сердце Петербурга
            </p>
            {hotel.address && (
              <p className="flex items-center gap-2 font-semibold text-sun">
                <MapPin className="size-5" aria-hidden />
                {hotel.address.replace("Санкт-Петербург, ", "")}
              </p>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-8">
          <BookingSearchForm />
        </div>
      </section>

      {/* Почему выбирают */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <p className="font-hand text-3xl font-bold leading-tight -rotate-3 sm:text-4xl">
            Питер — это не просто город.
            <br />
            Это состояние души.
          </p>
          <BrushUnderline className="mt-1 h-3 w-48 -rotate-3" />
          <SketchArt className="mt-4 w-full max-w-md text-ink/80" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Почему выбирают
            <br />
            Смарт Румс?
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-sun">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* О нас */}
      <section id="about" className="scroll-mt-4 overflow-hidden bg-ink text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-5">
            <h2 className="font-hand text-4xl font-bold leading-tight sm:text-5xl">
              Смарт Румс — ваш удобный старт для знакомства с{" "}
              <span className="text-sun">Петербургом</span>
            </h2>
            <BrushUnderline className="h-3 w-56" />
            <p className="max-w-md text-cream/85">
              Вы приходите в наш отель за отдыхом, а уезжаете с ощущением, что
              влюбились в этот город.
            </p>
          </div>
          <div className="relative mx-auto flex w-full max-w-lg items-start justify-center gap-4">
            <figure className="w-1/2 -rotate-3 rounded-sm bg-white p-2 pb-8 text-ink shadow-xl">
              <PhotoPlaceholder variant="metro" className="aspect-[3/4] w-full" />
              <figcaption className="mt-2 text-center font-hand text-lg">
                Метро — 2 минуты
              </figcaption>
            </figure>
            <figure className="mt-8 w-1/2 rotate-3 rounded-sm bg-white p-2 pb-8 text-ink shadow-xl">
              <PhotoPlaceholder variant="embankment" className="aspect-[3/4] w-full" />
              <figcaption className="mt-2 text-center font-hand text-lg">
                Набережные, дворцы, музеи
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Номера — общий блок без карточек/цен, см. CLAUDE.md раздел 5 */}
      <section id="rooms" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-16">
        <div className="grid gap-8 rounded-3xl bg-card p-8 shadow-sm sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight">Номера</h2>
            <p className="text-muted-foreground">
              У нас несколько типов номеров — от уютных двухместных до
              просторных семейных, рассчитанных на большую компанию.
              Актуальные фото, описания, цены и наличие на конкретные даты вы
              увидите на странице бронирования.
            </p>
          </div>
          <Button asChild size="lg" className="h-14 rounded-full px-8 text-base font-bold">
            <Link href="/booking">Смотреть номера и цены</Link>
          </Button>
        </div>
      </section>

      {/* Расположение */}
      <section
        id="location"
        className="mx-auto flex max-w-6xl scroll-mt-4 flex-col gap-4 px-4 pb-16"
      >
        <h2 className="text-3xl font-extrabold tracking-tight">Расположение</h2>
        <p className="max-w-2xl text-muted-foreground">
          {hotel.address}
          {hotel.metroNote && ` · ${hotel.metroNote}`}
        </p>
        <div>
          <Button asChild variant="outline" className="rounded-full">
            <a href={mapHref} target="_blank" rel="noopener noreferrer">
              Открыть на карте
            </a>
          </Button>
        </div>
      </section>

      {/* Контакты — данные из src/content/site.ts */}
      <section
        id="contacts"
        className="mx-auto flex max-w-6xl scroll-mt-4 flex-col gap-4 px-4 pb-20"
      >
        <h2 className="text-3xl font-extrabold tracking-tight">Контакты</h2>
        <div className="max-w-xl">
          <ContactList />
        </div>
      </section>
    </main>
  );
}
