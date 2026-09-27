"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoWordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/nav";

/**
 * На главной навигация встроена в верхнюю часть hero-карточки (см. HomePage) —
 * здесь она не дублируется. На остальных страницах — обычная светлая полоса.
 */
export function SiteHeader() {
  if (usePathname() === "/") return null;

  return (
    <header className="z-20 w-full border-b bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" aria-label="Смарт Румс — на главную">
          <LogoWordmark />
        </Link>
        <nav aria-label="Основная навигация" className="flex items-center gap-6 text-sm">
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-foreground/70 hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="rounded-full px-5 font-semibold">
            <Link href="/booking">Забронировать</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
