"use client";

import { Menu, MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { LogoWordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { hotel, phoneHref } from "@/content/site";
import { NAV_LINKS } from "@/lib/nav";

/** На главной HeaderNav встроен в hero, на остальных страницах — в светлую шапку. */
export function SiteHeader() {
  if (usePathname() === "/") return null;

  return (
    <header className="relative z-20 w-full border-b border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-2 sm:px-3 md:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-3 px-6 py-4 sm:px-8 md:px-[56px]">
          <Link href="/" aria-label="Смарт румс — на главную" className="shrink-0">
            <LogoWordmark />
          </Link>
          <HeaderNav variant="light" />
        </div>
      </div>
    </header>
  );
}

export function HeaderNav({ variant }: { variant: "light" | "overlay" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const overlay = variant === "overlay";
  const dim = overlay ? "text-white/80" : "text-foreground/70";
  const hoverBright = overlay ? "hover:text-white" : "hover:text-foreground";
  const menuLinks = [...NAV_LINKS, { href: "/rules", label: "Правила проживания" }];

  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
    function onPointerDown(event: PointerEvent) {
      if (!navRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onFocusIn(event: FocusEvent) {
      if (!navRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    }
    const wide = window.matchMedia("(min-width: 1280px)");
    const onResize = () => { if (wide.matches) setMenuOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  return (
    <nav ref={navRef} aria-label="Основная навигация" className="relative flex shrink-0 items-center gap-2 text-[17px] sm:gap-3 xl:gap-5">
      <ul className="hidden items-center gap-10 xl:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={`${dim} ${hoverBright} decoration-lantern underline-offset-4 transition-colors hover:underline`}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      {hotel.phone && (
        <a href={phoneHref(hotel.phone)} aria-label={`Позвонить: ${hotel.phone}`}
          className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${dim} ${hoverBright} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lantern`}>
          <Phone className="size-5" aria-hidden />
        </a>
      )}
      {hotel.messengerHref && (
        <a href={hotel.messengerHref} target="_blank" rel="noopener noreferrer" aria-label="Написать в мессенджер"
          className={`hidden size-11 items-center justify-center rounded-lg xl:flex ${dim} ${hoverBright}`}>
          <MessageCircle className="size-5" aria-hidden />
        </a>
      )}
      <Button asChild variant={overlay ? "default" : "dark"}
        className="hidden rounded-[10px] px-5 text-[15px] font-medium sm:inline-flex xl:px-7 xl:text-base">
        <Link href="/booking">Забронировать</Link>
      </Button>
      <button ref={triggerRef} type="button" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls={menuId}
        onClick={() => setMenuOpen((current) => !current)}
        className={`flex size-11 shrink-0 items-center justify-center rounded-lg border xl:hidden ${overlay ? "border-white/25 text-white hover:bg-white/10" : "border-border text-foreground hover:bg-muted"} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lantern`}>
        {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>
      {menuOpen && (
        <div ref={menuRef} id={menuId} role="dialog" aria-label="Меню сайта"
          className={`absolute right-0 top-full z-50 mt-3 grid max-h-[calc(100dvh-10rem)] w-80 max-w-[calc(100vw-4rem)] gap-3 overflow-y-auto rounded-2xl border p-4 shadow-2xl xl:hidden ${overlay ? "border-white/20 bg-neva text-white" : "border-border bg-card text-foreground"}`}>
          <ul className="grid">
            {menuLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-base hover:bg-granite/15 focus-visible:outline-2 focus-visible:outline-lantern">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild variant={overlay ? "default" : "dark"} className="h-11 w-full">
            <Link href="/booking" onClick={() => setMenuOpen(false)}>Забронировать</Link>
          </Button>
          {hotel.phone && (
            <a href={phoneHref(hotel.phone)} className="grid min-h-11 content-center gap-1 border-t border-current/15 px-3 pt-3 text-sm">
              <span className="opacity-65">Позвонить в отель</span>
              <span className="font-medium">{hotel.phone}</span>
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
