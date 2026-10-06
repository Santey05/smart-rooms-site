"use client";

import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoWordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { hotel, phoneHref } from "@/content/site";
import { NAV_LINKS } from "@/lib/nav";

/**
 * На главной навигация встроена в верхнюю часть hero-карточки (см. HomePage)
 * — здесь она не дублируется. На остальных страницах — обычная светлая
 * полоса с тем же набором элементов (раздел 6.1 спецификации).
 */
export function SiteHeader() {
  if (usePathname() === "/") return null;

  return (
    <header className="z-20 w-full border-b border-border bg-background text-foreground">
      {/* Горизонтальные отступы — те же, что у навигации внутри hero-карточки
          на главной (page.tsx: p-2 sm:p-3 md:p-6 lg:p-12 снаружи и
          px-6 sm:px-8 md:px-[56px] у nav), чтобы логотип и меню стояли на
          одних и тех же местах на всех страницах и не разъезжались шире. */}
      <div className="mx-auto max-w-7xl px-2 sm:px-3 md:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-6 px-6 py-4 sm:px-8 md:px-[56px]">
          <Link href="/" aria-label="Смарт румс — на главную">
            <LogoWordmark />
          </Link>
          <HeaderNav variant="light" />
        </div>
      </div>
    </header>
  );
}

/**
 * Содержимое навигации: ссылки, быстрый контакт, кнопка «Забронировать»
 * (раздел 6.1 спецификации; переключатель RU/EN из спецификации не
 * добавлен — на сайте только русский текст, английской версии нет).
 * Используется и здесь, и внутри hero-карточки на главной — оттуда и
 * variant="overlay".
 */
export function HeaderNav({ variant }: { variant: "light" | "overlay" }) {
  const dim = variant === "overlay" ? "text-white/80" : "text-foreground/70";
  const hoverBright = variant === "overlay" ? "hover:text-white" : "hover:text-foreground";

  return (
    <nav aria-label="Основная навигация" className="flex items-center gap-5 text-[17px]">
      <ul className={cnList()}>
        {NAV_LINKS.map((link) => (
          <li key={link.href} className="relative">
            <Link
              href={link.href}
              className={`${dim} ${hoverBright} decoration-lantern underline-offset-4 transition-colors hover:underline`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {hotel.phone && (
        <div className={`hidden items-center gap-3 lg:flex ${dim}`}>
          <a
            href={phoneHref(hotel.phone)}
            aria-label={`Позвонить: ${hotel.phone}`}
            className={hoverBright}
          >
            <Phone className="size-[18px]" aria-hidden />
          </a>
          {hotel.messengerHref && (
            <a
              href={hotel.messengerHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в мессенджер"
              className={hoverBright}
            >
              <MessageCircle className="size-[18px]" aria-hidden />
            </a>
          )}
        </div>
      )}

      <Button
        asChild
        variant={variant === "overlay" ? "default" : "dark"}
        className="rounded-[10px] px-[28px] py-[14px] text-[16px] font-medium"
      >
        <Link href="/booking">Забронировать</Link>
      </Button>
    </nav>
  );
}

function cnList() {
  return "hidden items-center gap-10 md:flex";
}
