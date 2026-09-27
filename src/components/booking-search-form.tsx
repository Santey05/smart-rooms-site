"use client";

import { CalendarDays, ChevronDown, Minus, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { DateRange } from "react-day-picker";

import { DateRangeCalendar } from "@/components/date-range-calendar";
import { Button } from "@/components/ui/button";
import { hotel, UNKNOWN_LABEL } from "@/content/site";
import { buildBookingHref } from "@/lib/booking";
import { cn } from "@/lib/utils";

/**
 * Карточка бронирования на главной (тёмное стекло поверх hero).
 *
 * Правило CLAUDE.md 4.1: эта форма ничего не проверяет и не считает.
 * Она только собирает дату заезда, дату выезда, число взрослых и детей
 * и передаёт их на страницу /booking, где всё остальное делает модуль
 * Bnovo. Цену и время заезда/выезда карточка не рассчитывает — время
 * заезда/выезда показывает как факт из src/content/site.ts (раздел 5.3:
 * цены на сайте не показываются вовсе).
 *
 * Даты хранятся как локальные Date (не строки YYYY-MM-DD через UTC), чтобы
 * день не сдвигался для гостей в других часовых поясах.
 */

function startOfToday(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** ДД.ММ.ГГГГ */
function formatDate(date: Date | undefined): string {
  if (!date) return "Выберите дату";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${date.getFullYear()}`;
}

/** Склонение: 1 взрослый, 2 взрослых, 5 взрослых. */
function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function guestsLabel(adults: number, children: number): string {
  const a = `${adults} ${plural(adults, "взрослый", "взрослых", "взрослых")}`;
  if (children === 0) return a;
  return `${a}, ${children} ${plural(children, "ребёнок", "ребёнка", "детей")}`;
}

// Панели дат/гостей — светлый попап поверх тёмной карточки, растёт влево:
// карточка обычно прижата к правому краю hero, растущий вправо попап уехал
// бы за экран.
const panelClass =
  "absolute right-0 top-full z-30 mt-3 max-w-[calc(100vw-2rem)] rounded-2xl border bg-white p-4 text-ink shadow-xl";

function useIsWide(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(min-width: 640px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 640px)").matches,
    () => true,
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          aria-label={`Уменьшить: ${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="size-4" />
        </Button>
        <span className="w-5 text-center tabular-nums" aria-live="polite">
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          aria-label={`Увеличить: ${label}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// Общий вид тёмных плашек-полей внутри карточки (даты, гости).
const darkFieldClass =
  "flex w-full cursor-pointer flex-col items-start gap-0.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition-colors outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sun/60";

function DateField({
  label,
  value,
  open,
  controls,
  onClick,
}: {
  label: string;
  value: Date | undefined;
  open: boolean;
  controls: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      className={cn(darkFieldClass, open && "bg-white/10")}
    >
      <span className="flex items-center gap-1 text-[0.65rem] uppercase tracking-wide text-cream/55">
        <CalendarDays className="size-3.5" aria-hidden />
        {label}
      </span>
      <span className="text-sm font-semibold text-white">{formatDate(value)}</span>
    </button>
  );
}

type OpenPanel = "dates" | "guests" | null;

export function BookingSearchForm() {
  const router = useRouter();
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const wide = useIsWide();

  // today фиксируем один раз на монтирование, чтобы календарь не «прыгал».
  const [today] = useState(startOfToday);
  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: addDays(startOfToday(), 1),
    to: addDays(startOfToday(), 2),
  }));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [open, setOpen] = useState<OpenPanel>(null);

  // Закрываем панели по клику вне формы и по Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!formRef.current?.contains(event.target as Node)) setOpen(null);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle(panel: Exclude<OpenPanel, null>) {
    setOpen((current) => (current === panel ? null : panel));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Без обеих дат переходить в модуль рано — просим выбрать даты.
    if (!range?.from || !range.to) {
      setOpen("dates");
      return;
    }

    router.push(
      buildBookingHref({
        checkIn: range.from,
        checkOut: range.to,
        adults,
        children: children > 0 ? children : undefined,
      }),
    );
  }

  const datesPanelId = `${formId}-dates`;
  const guestsPanelId = `${formId}-guests`;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative flex w-full flex-col gap-4 rounded-[1.75rem] border border-white/15 bg-ink/70 p-5 text-cream shadow-2xl backdrop-blur-xl sm:p-6"
    >
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-cream/55">
          Бронирование
        </p>
        <p className="mt-1 text-lg font-bold text-white">{hotel.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <DateField
          label="Заезд"
          value={range?.from}
          open={open === "dates"}
          controls={datesPanelId}
          onClick={() => toggle("dates")}
        />
        <DateField
          label="Выезд"
          value={range?.to}
          open={open === "dates"}
          controls={datesPanelId}
          onClick={() => toggle("dates")}
        />
      </div>

      {/* Время заезда/выезда — факт из src/content/site.ts, не расчёт сайта. */}
      <div className="grid grid-cols-2 divide-x divide-white/10 overflow-hidden rounded-2xl bg-white/5 text-sm">
        <div className="px-3 py-2.5">
          <p className="text-[0.65rem] uppercase tracking-wide text-cream/55">Заезд с</p>
          <p className="font-medium text-white">
            {hotel.checkInTime ?? UNKNOWN_LABEL}
          </p>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[0.65rem] uppercase tracking-wide text-cream/55">Выезд до</p>
          <p className="font-medium text-white">
            {hotel.checkOutTime ?? UNKNOWN_LABEL}
          </p>
        </div>
      </div>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open === "guests"}
          aria-controls={guestsPanelId}
          onClick={() => toggle("guests")}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-left transition-colors outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-sun/60",
            open === "guests" && "bg-white/10",
          )}
        >
          <span className="flex items-center gap-2">
            <User className="size-4 shrink-0 text-cream/60" aria-hidden />
            <span className="text-sm font-semibold text-white">
              {guestsLabel(adults, children)}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-cream/60 transition-transform",
              open === "guests" && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        {open === "guests" && (
          <div
            id={guestsPanelId}
            role="dialog"
            aria-label="Выбор гостей"
            className={cn(panelClass, "grid w-72 gap-4")}
          >
            <Stepper label="Взрослые" value={adults} min={1} max={10} onChange={setAdults} />
            <Stepper label="Дети" value={children} min={0} max={10} onChange={setChildren} />
            <Button type="button" size="sm" className="rounded-full" onClick={() => setOpen(null)}>
              Готово
            </Button>
          </div>
        )}
      </div>

      <Button type="submit" size="lg" className="h-12 w-full rounded-2xl text-base font-bold">
        Проверить наличие
      </Button>

      {open === "dates" && (
        <div
          id={datesPanelId}
          role="dialog"
          aria-label="Выбор дат"
          className={cn(panelClass, "grid gap-4")}
        >
          <DateRangeCalendar
            range={range}
            onRangeChange={setRange}
            today={today}
            numberOfMonths={wide ? 2 : 1}
          />
          <Button
            type="button"
            size="sm"
            className="rounded-full"
            disabled={!range?.from || !range.to}
            onClick={() => setOpen(null)}
          >
            Готово
          </Button>
        </div>
      )}
    </form>
  );
}
