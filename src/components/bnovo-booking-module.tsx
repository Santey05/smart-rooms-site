"use client";

import Script from "next/script";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BookingModuleSkeleton } from "@/components/booking-module-skeleton";
import { Button } from "@/components/ui/button";
import { hotel, phoneHref } from "@/content/site";
import { parseBnovoChildren } from "@/lib/booking";

/**
 * Встраивание Bnovo по CLAUDE.md, раздел 6.1. Цены, доступность, данные
 * гостя и оплату обрабатывает только Bnovo. Загрузка iframe не подтверждает
 * работоспособность бронирования — нужен ручной сценарий из раздела 12.3.
 */
const BNOVO_HTML_ID = "bnovo_booking";
const LOADING_TIMEOUT_MS = 20_000;
type LoadingState = "loading" | "loaded" | "slow" | "error";

declare global {
  interface Window {
    BookingIframe?: new (options: Record<string, string>) => { init: () => void };
  }
}

export function BnovoBookingModule() {
  const params = useSearchParams();
  const uid = process.env.NEXT_PUBLIC_BNOVO_UID;
  const childAges = parseBnovoChildren(params.get("children"));
  const validChildren = childAges !== null;
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<LoadingState>("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !uid || !validChildren) return;

    const frames = new Set<HTMLIFrameElement>();
    // load означает загрузку документа iframe, не успешную бронь
    // и не подтверждение работоспособности содержимого чужого домена.
    const onFrameLoad = () => setState("loaded");
    function watchFrames() {
      container?.querySelectorAll("iframe").forEach((frame) => {
        if (frames.has(frame)) return;
        frames.add(frame);
        if (!frame.title) frame.title = "Онлайн-бронирование Смарт румс";
        frame.addEventListener("load", onFrameLoad);
      });
    }

    const observer = new MutationObserver(watchFrames);
    observer.observe(container, { childList: true, subtree: true });
    watchFrames();
    const timeout = window.setTimeout(() => {
      setState((current) => (current === "loading" ? "slow" : current));
    }, LOADING_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      frames.forEach((frame) => frame.removeEventListener("load", onFrameLoad));
    };
  }, [uid, validChildren]);

  // Старые ссылки содержат количество детей. Возраст из него узнать нельзя.
  if (!validChildren) {
    return (
      <div role="alert" className="grid gap-3 rounded-xl border border-border bg-background p-5 text-sm">
        <p className="font-medium">Укажите возраст каждого ребёнка</p>
        <p className="text-muted-foreground">
          Для поиска с детьми нужен возраст каждого ребёнка от 6 до 17 лет. Вернитесь к форме поиска и выберите возраст.
        </p>
        <Button asChild variant="dark" className="w-fit">
          <Link href="/#hero-card">Выбрать возраст детей</Link>
        </Button>
      </div>
    );
  }

  const needsHelp = state === "error" || state === "slow" || !uid;

  return (
    <>
      {needsHelp && (
        <div
          role={state === "error" || !uid ? "alert" : "status"}
          className="mb-4 grid gap-3 rounded-xl border border-border bg-background p-5 text-sm"
        >
          <p className="font-medium">
            {!uid || state === "error"
              ? "Не удалось загрузить модуль бронирования."
              : "Загрузка занимает больше времени, чем обычно."}
          </p>
          {needsHelp && (
            <>
              <p className="text-muted-foreground">
                {state === "slow" && uid
                  ? "Можно подождать ещё немного или обновить страницу. Выбранные даты и гости сохранятся."
                  : "Попробуйте обновить страницу или свяжитесь с нами, чтобы уточнить варианты размещения."}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button type="button" variant="dark" onClick={() => window.location.reload()}>
                  Обновить страницу
                </Button>
                {hotel.phone && (
                  <a href={phoneHref(hotel.phone)} className="underline underline-offset-4">
                    Позвонить: {hotel.phone}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      )}
      <div className="relative" aria-busy={state === "loading" && Boolean(uid)}>
        {state === "loading" && uid && <BookingModuleSkeleton />}
        <div
          ref={containerRef}
          id={BNOVO_HTML_ID}
          className={state === "loading" ? "pointer-events-none absolute inset-x-0 top-0 opacity-0" : undefined}
          inert={state === "loading"}
          aria-hidden={state === "loading" ? true : undefined}
        />
      </div>
      {uid && (
        <Script
          src="https://widget.reservationsteps.ru/iframe/library/dist/booking_iframe.js"
          strategy="afterInteractive"
          onError={() => setState("error")}
          onReady={() => {
            if (!window.BookingIframe) {
              setState("error");
              return;
            }
            try {
              new window.BookingIframe({
                html_id: BNOVO_HTML_ID,
                uid,
                lang: "ru",
                width: "auto",
                height: "auto",
                rooms: params.get("room") ?? "", // ID типа номера, CLAUDE.md 5.2
                dfrom: params.get("dfrom") ?? "",
                dto: params.get("dto") ?? "",
                adults: params.get("adults") ?? "2",
                children: JSON.stringify(childAges), // массив возрастов, отдельно от adults — CLAUDE.md 6.4
                promoCode: params.get("promoCode") ?? "", // CLAUDE.md 6.5
              }).init();
            } catch {
              setState("error");
            }
          }}
        />
      )}
    </>
  );
}
