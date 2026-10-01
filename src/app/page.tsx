import { BedDouble, MapPin, Star, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { LogoWordmark } from "@/components/brand/logo";
import { PetersburgExplorer } from "@/components/brand/petersburg-explorer";
import { BookingSearchForm } from "@/components/booking-search-form";
import { ContactList } from "@/components/contact-list";
import { HeaderNav } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { hotel } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Смарт румс — мини-отель на Марата, 30, Санкт-Петербург",
  description:
    "Мини-отель в доме 1860 года на улице Марата. Пять минут пешком до метро «Владимирская».",
  alternates: { canonical: "/" },
};

/**
 * Структурированные данные Hotel/schema.org — только на главной (CLAUDE.md,
 * раздел 7). Поля собираются из content/site.ts; то, чего ещё не знаем
 * (null), просто не попадает в разметку — вместо «Уточняется» в JSON-LD
 * должно быть либо реальное значение, либо отсутствие поля.
 */
function buildHotelJsonLd() {
  if (!hotel.address) return null;

  const [addressLocality, ...rest] = hotel.address.split(",").map((part) => part.trim());

  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    url: SITE_URL,
    image: `${SITE_URL}/images/room/overview.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: rest.join(", "),
      addressLocality,
      addressCountry: "RU",
    },
    ...(hotel.coords && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: hotel.coords.lat,
        longitude: hotel.coords.lon,
      },
    }),
    ...(hotel.phone && { telephone: hotel.phone }),
  };
}

const BENEFITS = [
  {
    icon: MapPin,
    title: "Центр города",
    text: `${hotel.address?.replace("Санкт-Петербург, ", "") ?? "Центр города"} — рядом метро, кафе, достопримечательности.`,
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
    text: "Самостоятельное заселение по коду, Wi-Fi.",
  },
] as const;

export default function HomePage() {
  const mapHref = `https://yandex.ru/maps/?text=${encodeURIComponent(hotel.address ?? "")}`;
  const hotelJsonLd = buildHotelJsonLd();

  return (
    <main>
      {hotelJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }} />
      )}
      {/* Hero — по дизайн-спецификации hero-экрана (Sep 27, 2026).
          max-w-7xl — та же ширина, что и у остальных секций страницы, иначе
          на очень широких мониторах карточка растягивается непропорционально. */}
      <div className="mx-auto max-w-7xl p-2 sm:p-3 md:p-6 lg:p-12">
        <section className="relative isolate flex flex-col overflow-visible rounded-[24px] bg-neva text-white shadow-[0_40px_100px_-30px_rgba(14,20,28,0.6)] lg:min-h-[min(900px,calc(100vh-6rem))] lg:rounded-[32px]">
          {/* Фото/иллюстрация — обрезана по скруглению; попапы карточки
              бронирования могут выходить за этот слой. */}
          <div className="absolute inset-0 overflow-hidden rounded-[24px] lg:rounded-[32px]">
            {/*
              Сгенерированные фото (не реальная съёмка дома на Марата, 30 —
              собственной фотографии пока нет, см. CLAUDE.md раздел 7).
              Отдельные кадры для десктопа (16:9) и мобильных (9:16), чтобы
              тёплый фонарь не терялся при обрезке на узких экранах.
              Обычный <picture>, а не next/image: у next/image нет
              художественной обрезки по брейкпоинту (разные источники для
              разных экранов) — с двумя <Image priority> браузер предзагрузил
              бы оба файла сразу, независимо от того, какой скрыт по CSS.
            */}
            <picture>
              <source media="(min-width: 1024px)" srcSet="/images/hero-desktop.webp" />
              <img
                src="/images/hero-mobile.webp"
                alt="Вечерняя улица в историческом центре Санкт-Петербурга, фонарь и тёплые окна в тумане"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </picture>
            {/* Оверлеи читаемости (раздел 3 спецификации) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,20,28,0.7)] from-0% to-transparent to-[45%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(14,20,28,0.4)] from-0% to-transparent to-[50%]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.2)] from-0% to-transparent to-[20%]" />
          </div>

          {/* Навигация внутри карточки (раздел 6.1) */}
          <nav
            aria-label="Основная навигация"
            className="relative z-10 flex items-center justify-between gap-4 px-6 py-5 sm:px-8 md:px-[56px] md:py-6"
          >
            <Link href="/" aria-label="Смарт румс — на главную">
              <LogoWordmark />
            </Link>
            <HeaderNav variant="overlay" />
          </nav>

          {/* Заголовок → описание/локация → карточка бронирования */}
          <div className="relative z-10 flex flex-1 flex-col px-6 pb-8 sm:px-8 md:px-[56px] md:pb-12">
            <h1 className="mt-10 max-w-xl text-[clamp(52px,7.2vw,120px)] leading-[0.9] font-normal tracking-[-0.03em] md:mt-[70px] lg:mt-[110px]">
              <span className="block">Живите</span>
              <span className="font-accent block text-granite italic">в сердце</span>
              <span className="block">Петербурга</span>
            </h1>

            <div className="mt-14 flex flex-col gap-10 lg:mt-auto lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:pt-10">
              <div className="flex max-w-[340px] flex-col gap-8">
                <p className="text-[18px] leading-[1.4] tracking-[-0.005em] text-white/90">
                  Мини-отель в доме {hotel.builtYear ?? ""} года на улице Марата. Парадные,
                  дворы-колодцы и набережные начинаются прямо за дверью, а вечером вас ждёт
                  тихий номер.
                </p>

                {/* Блок локации — вместо рейтинга референса (раздел 6.4) */}
                <div className="flex flex-col gap-1">
                  {hotel.metroMinutes != null && (
                    <p className="flex items-baseline gap-2">
                      <MapPin className="relative top-[3px] size-[22px] shrink-0 text-lantern" aria-hidden />
                      <span className="text-[34px] leading-none tracking-[-0.02em]">
                        {hotel.metroMinutes} мин
                      </span>
                    </p>
                  )}
                  {hotel.metroStation && (
                    <p className="pl-[30px] text-[16px] text-white/90">
                      пешком до метро «{hotel.metroStation}»
                    </p>
                  )}
                  {hotel.address && (
                    <a
                      href={mapHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pl-[30px] text-sm text-granite underline-offset-4 hover:text-white hover:underline"
                    >
                      {hotel.address.replace("Санкт-Петербург, ", "")}
                    </a>
                  )}
                </div>
              </div>

              <div id="hero-card" className="w-full scroll-mt-6 lg:w-[400px] lg:shrink-0">
                <BookingSearchForm />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Мобильная sticky-кнопка (раздел 7, адаптив &lt;768px) */}
      <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
        <Button asChild variant="default" className="h-12 w-full rounded-[10px] shadow-2xl">
          <a href="#hero-card">Забронировать</a>
        </Button>
      </div>

      {/* Почему выбирают */}
      <section className="mx-auto grid max-w-7xl gap-10 px-2 py-16 pb-28 sm:px-3 md:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:pb-16">
        <p className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="block text-foreground">Петербург — не открыточный вид,</span>
          <span className="block text-muted-foreground">а место, где вы живёте.</span>
        </p>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Почему выбирают Смарт румс</h2>
          <ul className="mt-8 grid items-start gap-8 sm:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-lantern">
                  <Icon className="size-5 text-text-dark" aria-hidden />
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

      {/* Номера — общий блок без карточек/цен, см. CLAUDE.md раздел 5 */}
      <section
        id="rooms"
        className="mx-auto max-w-7xl scroll-mt-4 px-2 py-16 sm:px-3 md:px-6 lg:px-12"
      >
        <div className="overflow-hidden rounded-[24px] bg-card shadow-sm">
          {/* Реальные фото одного из номеров (не постановочные) — общая
              атмосфера, без привязки к конкретному названию/типу/цене
              (раздел 5 CLAUDE.md: каталога номеров на сайте нет, это
              маркетинговое фото, а не RoomContent). */}
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 sm:grid-rows-2 sm:gap-1.5">
            <div className="relative col-span-2 aspect-[16/10] sm:aspect-auto sm:row-span-2">
              <Image
                src="/images/room/overview.jpg"
                alt="Номер «Смарт румс»: спальная зона и кухонная ниша"
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square">
              <Image
                src="/images/room/lounge.jpg"
                alt="Номер «Смарт румс»: диван и дополнительные спальные места"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square">
              <Image
                src="/images/room/bed-detail.jpg"
                alt="Кровать в номере «Смарт румс», застеленная к заезду"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square">
              <Image
                src="/images/room/entry.jpg"
                alt="Прихожая и санузел в номере «Смарт румс»"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square">
              <Image
                src="/images/room/lounge-alt.jpg"
                alt="Номер «Смарт румс»: зона отдыха"
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex max-w-2xl flex-col gap-3">
              <h2 className="text-3xl font-bold tracking-tight">Номера</h2>
              <p className="text-muted-foreground">
                У нас несколько типов номеров — от уютных двухместных до просторных семейных,
                рассчитанных на большую компанию. Актуальные фото, описания, цены и наличие на
                конкретные даты вы увидите на странице бронирования.
              </p>
            </div>
            <Button asChild variant="dark" className="h-14 rounded-[10px] px-8 text-base">
              <Link href="/booking">Смотреть номера и цены</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Петербург рядом — редакционный блок «одно место за раз» +
          карта, см. src/components/brand/petersburg-explorer.tsx */}
      <section
        id="location"
        className="mx-auto max-w-7xl scroll-mt-4 px-2 pb-16 sm:px-3 md:px-6 lg:px-12"
      >
        <p className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="block text-foreground">Это не список достопримечательностей,</span>
          <span className="block text-muted-foreground">а то, что будет у вас под окнами.</span>
        </p>
        <PetersburgExplorer />
      </section>

      {/* Контакты — данные из src/content/site.ts */}
      <section
        id="contacts"
        className="mx-auto flex max-w-7xl scroll-mt-4 flex-col gap-4 px-2 pb-20 sm:px-3 md:px-6 lg:px-12"
      >
        <h2 className="text-3xl font-bold tracking-tight">Контакты</h2>
        <div className="max-w-xl">
          <ContactList />
        </div>
      </section>
    </main>
  );
}
