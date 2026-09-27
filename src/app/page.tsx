import { BedDouble, MapPin, Star, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { HeroArt, PhotoPlaceholder } from "@/components/brand/petersburg-art";
import { LogoWordmark } from "@/components/brand/logo";
import { BookingSearchForm } from "@/components/booking-search-form";
import { ContactList } from "@/components/contact-list";
import { NAV_LINKS } from "@/lib/nav";
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
      {/* Hero: врезанная карточка со скруглёнными углами — навигация,
          заголовок и карточка бронирования лежат внутри одной иллюстрации. */}
      <div className="p-3 sm:p-4 lg:p-5">
        <section className="relative isolate flex min-h-[42rem] flex-col overflow-visible rounded-[1.75rem] bg-ink text-white shadow-[0_40px_100px_-30px_oklch(0.21_0.04_265/0.6)] sm:rounded-[2.25rem] lg:min-h-[46rem]">
          {/* Иллюстрация — временная замена фото (CLAUDE.md, раздел 7); слой
              обрезан по скруглению, панели формы поиска могут выходить за него. */}
          <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem]">
            <HeroArt />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/5 to-ink/45" />
          </div>

          {/* Навигация внутри карточки */}
          <nav
            aria-label="Основная навигация"
            className="relative z-10 flex items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-6"
          >
            <Link href="/" aria-label="Смарт Румс — на главную">
              <LogoWordmark />
            </Link>
            <ul className="hidden items-center gap-6 text-sm text-white/80 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild className="rounded-full px-5 font-semibold">
              <Link href="/booking">Забронировать</Link>
            </Button>
          </nav>

          {/* Заголовок + карточка бронирования */}
          <div className="relative z-10 flex flex-1 flex-col justify-end gap-8 px-5 pb-6 sm:px-8 sm:pb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-12 lg:pb-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                Санкт-Петербург
              </p>
              <h1 className="mt-3 text-6xl font-bold leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
                <span className="block">Ближе,</span>
                <span className="block text-white/40">чем</span>
                <span className="block">кажется</span>
              </h1>
              <p className="mt-6 max-w-sm text-base text-white/80 sm:text-lg">
                Уютный и недорогой мини-отель в самом сердце Петербурга.
              </p>
              {hotel.address && (
                <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-sun">
                  <MapPin className="size-4 shrink-0" aria-hidden />
                  {hotel.address.replace("Санкт-Петербург, ", "")}
                  {hotel.metroNote && (
                    <span className="font-normal text-white/60">· {hotel.metroNote}</span>
                  )}
                </p>
              )}
            </div>

            <div className="w-full lg:w-[22rem] lg:shrink-0">
              <BookingSearchForm />
            </div>
          </div>
        </section>
      </div>

      {/* Почему выбирают */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:gap-16">
        <p className="text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl">
          <span className="block text-foreground">Питер — это не просто город.</span>
          <span className="block text-muted-foreground">Это состояние души.</span>
        </p>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Почему выбирают Смарт Румс</h2>
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
            <p className="text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl">
              <span className="block">Смарт Румс — ваш удобный старт</span>
              <span className="block text-cream/50">для знакомства с Петербургом.</span>
            </p>
            <p className="max-w-md text-cream/80">
              Вы приходите в наш отель за отдыхом, а уезжаете с ощущением, что
              влюбились в этот город.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <figure className="overflow-hidden rounded-2xl bg-white/5">
              <PhotoPlaceholder variant="metro" className="aspect-[3/4] w-full" />
              <figcaption className="px-3 py-2 text-sm text-cream/70">
                Метро — 2 минуты
              </figcaption>
            </figure>
            <figure className="mt-8 overflow-hidden rounded-2xl bg-white/5">
              <PhotoPlaceholder variant="embankment" className="aspect-[3/4] w-full" />
              <figcaption className="px-3 py-2 text-sm text-cream/70">
                Набережные, дворцы, музеи
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Номера — общий блок без карточек/цен, см. CLAUDE.md раздел 5 */}
      <section id="rooms" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-16">
        <div className="grid gap-8 rounded-[1.75rem] bg-card p-8 shadow-sm sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
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
