"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoWordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/#about", label: "О нас" },
  { href: "/#rooms", label: "Номера" },
  { href: "/#location", label: "Расположение" },
  { href: "/contacts", label: "Контакты" },
] as const;

/**
 * На главной шапка лежит поверх hero (белый текст), на остальных страницах —
 * обычная светлая полоса.
 */
export function SiteHeader() {
  const overlay = usePathname() === "/";

  return (
    <header
      className={cn(
        "z-20 w-full",
        overlay
          ? "absolute inset-x-0 top-0 text-white"
          : "border-b bg-background text-foreground",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/" aria-label="Смарт Румс — на главную">
          <LogoWordmark />
        </Link>
        <nav aria-label="Основная навигация" className="flex items-center gap-6 text-sm">
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="opacity-90 hover:opacity-100">
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
