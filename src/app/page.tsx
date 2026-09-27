import { BedDouble, MapPin, Star, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PhotoPlaceholder } from "@/components/brand/petersburg-art";
import { LogoWordmark } from "@/components/brand/logo";
import { BookingSearchForm } from "@/components/booking-search-form";
import { ContactList } from "@/components/contact-list";
import { HeaderNav } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { hotel } from "@/content/site";

export const metadata: Metadata = {
  title: "Смарт румс — мини-отель на Марата, 30, Санкт-Петербург",
  description:
    "Мини-отель в доме 1860 года на улице Марата. Пять минут пешком до метро «Владимирская».",
};

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
    text: "Удобное заселение, дружелюбный персонал, Wi-Fi.",
  },
] as const;

export default function HomePage() {
  const mapHref = `https://yandex.ru/maps/?text=${encodeURIComponent(hotel.address ?? "")}`;

  return (
    <main>
      {/* Hero — по дизайн-спецификации hero-экрана (Sep 27, 2026). */}
      <div className="p-2 sm:p-3 md:p-6 lg:p-12">
        <section className="relative isolate flex flex-col overflow-visible rounded-[24px] bg-neva text-white shadow-[0_40px_100px_-30px_rgba(14,20,28,0.6)] lg:min-h-[min(900px,calc(100vh-6rem))] lg:rounded-[32px]">
          {/* Фото/иллюстрация — обрезана по скруглению; попапы карточки
              бронирования могут выходить за этот слой. */}
          <div className="absolute inset-0 overflow-hidden rounded-[24px] lg:rounded-[32px]">
            {/*
              Сгенерированное фото (не реальная съёмка дома на Марата, 30 —
              собственной фотографии пока нет, см. CLAUDE.md раздел 7).
              Один и тот же кадр 16:9 используется и на мобильных: при
              вертикальной обрезке фонарь справа виден лишь частично, но
              читаемость текста не страдает. Когда появится отдельный
              вертикальный кадр — добавить <picture>/второй <Image>,
              скрытый через lg:hidden/hidden lg:block, а не переделывать
              этот блок целиком.
            */}
            <Image
              src="/images/hero-desktop.webp"
              alt="Вечерняя улица в историческом центре Санкт-Петербурга, фонарь и тёплые окна в тумане"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
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
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 pb-28 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-16">
        <p className="text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="block text-foreground">Петербург — не открыточный вид,</span>
          <span className="block text-muted-foreground">а место, где вы живёте.</span>
        </p>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Почему выбирают Смарт румс</h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2">
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

      {/* Об отеле */}
      <section id="about" className="scroll-mt-4 overflow-hidden bg-neva text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-5">
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="block">Смарт румс — удобный старт</span>
              <span className="block text-granite">для знакомства с Петербургом.</span>
            </p>
            <p className="max-w-md text-white/80">
              Вы приходите в наш отель за отдыхом, а уезжаете с ощущением, что влюбились в этот
              город.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <figure className="overflow-hidden rounded-2xl bg-white/5">
              <PhotoPlaceholder variant="metro" className="aspect-[3/4] w-full" />
              <figcaption className="px-3 py-2 text-sm text-white/70">
                Метро «Владимирская» — {hotel.metroMinutes ?? "…"} минут
              </figcaption>
            </figure>
            <figure className="mt-8 overflow-hidden rounded-2xl bg-white/5">
              <PhotoPlaceholder variant="embankment" className="aspect-[3/4] w-full" />
              <figcaption className="px-3 py-2 text-sm text-white/70">
                Набережные, дворы-колодцы, парадные
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Номера — общий блок без карточек/цен, см. CLAUDE.md раздел 5 */}
      <section id="rooms" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-16">
        <div className="grid gap-8 rounded-[24px] bg-card p-8 shadow-sm sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex max-w-2xl flex-col gap-4">
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
      </section>

      {/* Петербург рядом */}
      <section
        id="location"
        className="mx-auto flex max-w-6xl scroll-mt-4 flex-col gap-4 px-4 pb-16"
      >
        <h2 className="text-3xl font-bold tracking-tight">Петербург рядом</h2>
        <p className="max-w-2xl text-muted-foreground">
          {hotel.address}
          {hotel.metroStation &&
            hotel.metroMinutes != null &&
            ` · ${hotel.metroMinutes} мин пешком до метро «${hotel.metroStation}»`}
        </p>
        <div>
          <Button asChild variant="outline" className="rounded-[10px]">
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
        <h2 className="text-3xl font-bold tracking-tight">Контакты</h2>
        <div className="max-w-xl">
          <ContactList />
        </div>
      </section>
    </main>
  );
}
