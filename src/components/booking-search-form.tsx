"use client";

import { CalendarDays, ChevronDown, Minus, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { DateRange } from "react-day-picker";

import { DateRangeCalendar } from "@/components/date-range-calendar";
import { Button } from "@/components/ui/button";
import { buildBookingHref } from "@/lib/booking";
import { cn } from "@/lib/utils";

/**
 * Форма поиска дат/гостей на главной странице.
 *
 * Правило CLAUDE.md 4.1: эта форма ничего не проверяет и не считает.
 * Она только собирает дату заезда, дату выезда, число взрослых и детей
 * и передаёт их на страницу /booking, где всё остальное делает модуль
 * Bnovo. Не добавлять сюда проверку доступности/вместимости номеров.
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

// Две панели (даты и гости) выглядят одинаково: белая карточка под формой.
const panelClass =
  "absolute top-full z-30 mt-3 max-w-[calc(100vw-2rem)] rounded-2xl border bg-white p-4 text-ink shadow-xl";

// Общий вид кликабельного поля формы.
const fieldClass =
  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-1 text-left outline-none transition-colors hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ring/60";

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
    <div className="lg:border-r lg:pr-3">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={controls}
        onClick={onClick}
        className={cn(fieldClass, open && "bg-ink/5")}
      >
        <CalendarDays className="size-5 shrink-0 text-ink/70" aria-hidden />
        <span className="grid min-w-0 flex-1">
          <span className="text-xs text-ink/60">{label}</span>
          <span className="text-base font-semibold">{formatDate(value)}</span>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
    </div>
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
  const [adults, setAdults] = useState(2);
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
      className="relative grid gap-2 rounded-3xl bg-white p-3 text-ink shadow-2xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_auto] lg:items-center lg:rounded-full lg:p-3 lg:pl-6"
    >
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

      <div className="relative sm:col-span-2 lg:col-span-1">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open === "guests"}
          aria-controls={guestsPanelId}
          onClick={() => toggle("guests")}
          className={cn(fieldClass, open === "guests" && "bg-ink/5")}
        >
          <User className="size-5 shrink-0 text-ink/70" aria-hidden />
          <span className="grid flex-1">
            <span className="text-xs text-ink/60">Гости</span>
            <span className="text-base font-semibold">{guestsLabel(adults, children)}</span>
          </span>
          <ChevronDown
            className={cn("size-4 shrink-0 transition-transform", open === "guests" && "rotate-180")}
            aria-hidden
          />
        </button>

        {open === "guests" && (
          <div
            id={guestsPanelId}
            role="dialog"
            aria-label="Выбор гостей"
            className={cn(panelClass, "left-0 grid w-72 gap-4")}
          >
            <Stepper label="Взрослые" value={adults} min={1} max={10} onChange={setAdults} />
            <Stepper label="Дети" value={children} min={0} max={10} onChange={setChildren} />
            <Button type="button" size="sm" className="rounded-full" onClick={() => setOpen(null)}>
              Готово
            </Button>
          </div>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-14 rounded-full px-8 text-base font-bold sm:col-span-2 lg:col-span-1"
      >
        Проверить наличие
      </Button>

      {open === "dates" && (
        <div
          id={datesPanelId}
          role="dialog"
          aria-label="Выбор дат"
          className={cn(panelClass, "left-0 grid gap-4")}
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
