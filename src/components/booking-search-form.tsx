"use client";

import { CalendarDays, ChevronDown, Minus, Plus, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { DateRange } from "react-day-picker";

import { DateRangeCalendar } from "@/components/date-range-calendar";
import { Button } from "@/components/ui/button";
import { hotel, UNKNOWN_LABEL } from "@/content/site";
import { buildBookingHref } from "@/lib/booking";
import { cn } from "@/lib/utils";

/**
 * Карточка бронирования на главной — стеклянная карточка поверх hero-фото
 * (раздел 6.5 спецификации).
 *
 * Правило CLAUDE.md 4.1/5.3: эта карточка ничего не проверяет, не считает и
 * не показывает цену — она только собирает дату заезда, дату выезда, число
 * взрослых и детей и передаёт их на страницу /booking, где всё остальное
 * (номера, цены, доступность) показывает модуль Bnovo. Цена «от N ₽» из
 * раздела 6.5 спецификации сюда сознательно не перенесена — сайт не хранит
 * данные о номерах, показывать её не из чего (раздел 5.3 CLAUDE.md); в
 * самой спецификации эта цифра тоже отмечена как неподтверждённая заглушка
 * (раздел 9). Время заезда/выезда — факт из src/content/site.ts, а не
 * расчёт сайта.
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

const SHORT_MONTHS = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

/** «11 янв» — формат карточки (раздел 6.5 спецификации). */
function formatDateShort(date: Date | undefined): string {
  if (!date) return "выбрать";
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
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

// Попап дат/гостей — тёмное стекло, тот же материал, что у самой карточки
// (раздел 6.5). Растёт от правого края: карточка обычно прижата к правому
// краю hero, попап, растущий вправо, уехал бы за экран.
const panelClass =
  "absolute right-0 top-full z-30 mt-3 max-w-[calc(100vw-2rem)] rounded-2xl border border-glass-border bg-neva/90 p-4 text-white shadow-2xl backdrop-blur-xl";

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
          className="size-8 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
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
          className="size-8 rounded-full border-white/20 bg-transparent text-white hover:bg-white/10"
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

// Поля дат: field-bg, высота 50px, radius 10px (раздел 6.5).
const dateFieldClass =
  "flex h-[50px] w-full cursor-pointer items-center gap-2 rounded-[10px] bg-field-bg px-3 text-left outline-none transition-colors hover:bg-[rgba(16,24,32,0.7)] focus-visible:border focus-visible:border-white/50";

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
      aria-label={`${label}: ${value ? value.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "long" }) : "не выбрано"}`}
      onClick={onClick}
      className={cn(dateFieldClass, open && "bg-[rgba(16,24,32,0.7)]")}
    >
      <CalendarDays className="size-5 shrink-0 text-granite" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-white">
        {formatDateShort(value)}
      </span>
      <ChevronDown
        className={cn("size-4 shrink-0 text-granite transition-transform", open && "rotate-180")}
        aria-hidden
      />
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

  const hasDates = Boolean(range?.from && range.to);

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
      className="relative flex w-full flex-col gap-[18px] rounded-[24px] border border-glass-border bg-glass-bg p-[22px] text-white shadow-2xl backdrop-blur-[24px] backdrop-saturate-[1.2] sm:p-[30px]"
    >
      <div>
        <p className="text-[22px] leading-tight font-normal text-white sm:text-[28px]">
          {hotel.name}
        </p>
        {hotel.address && (
          <p className="mt-1 text-sm text-granite">
            мини-отель на {hotel.address.replace("Санкт-Петербург, ", "")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
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

      {/* Заезд/выезд — факт из src/content/site.ts, не расчёт сайта. */}
      <div className="grid grid-cols-2 divide-x divide-divider rounded-xl bg-field-bg">
        <div className="px-5 py-4">
          <p className="text-sm text-granite">Заезд</p>
          <p className="mt-0.5 text-[15px] text-white">
            {hotel.checkInTime ? `после ${hotel.checkInTime}` : UNKNOWN_LABEL}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-granite">Выезд</p>
          <p className="mt-0.5 text-[15px] text-white">
            {hotel.checkOutTime ? `до ${hotel.checkOutTime}` : UNKNOWN_LABEL}
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
            "flex w-full items-center justify-between gap-3 rounded-xl bg-field-bg px-4 py-3 text-left transition-colors outline-none hover:bg-[rgba(16,24,32,0.7)]",
            open === "guests" && "bg-[rgba(16,24,32,0.7)]",
          )}
        >
          <span className="flex items-center gap-2">
            <User className="size-4 shrink-0 text-granite" aria-hidden />
            <span className="text-[15px] font-medium text-white">
              {guestsLabel(adults, children)}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-granite transition-transform",
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
            <Button
              type="button"
              variant="default"
              size="sm"
              className="rounded-lg"
              onClick={() => setOpen(null)}
            >
              Готово
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          disabled={!hasDates}
          className="h-12 w-full rounded-[10px] text-base font-medium"
        >
          Забронировать
        </Button>
        <p className="text-[11px] leading-snug text-granite">
          Нажимая «Забронировать», вы соглашаетесь с{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
            политикой обработки персональных данных
          </Link>
          .
        </p>
      </div>

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
            variant="default"
            size="sm"
            className="rounded-lg"
            disabled={!hasDates}
            onClick={() => setOpen(null)}
          >
            Готово
          </Button>
        </div>
      )}
    </form>
  );
}
