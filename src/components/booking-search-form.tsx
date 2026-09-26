"use client";

import { CalendarDays, ChevronDown, Minus, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildBookingHref } from "@/lib/booking";

/**
 * Форма поиска дат/гостей на главной странице.
 *
 * Правило CLAUDE.md 4.1: эта форма ничего не проверяет и не считает.
 * Она только собирает дату заезда, дату выезда, число взрослых и детей
 * и передаёт их на страницу /booking, где всё остальное делает модуль
 * Bnovo. Не добавлять сюда проверку доступности/вместимости номеров.
 */

function defaultCheckIn(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function defaultCheckOut(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
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

const fieldInputClass =
  "h-auto border-0 bg-transparent p-0 text-base font-semibold shadow-none focus-visible:ring-0 md:text-base";

export function BookingSearchForm() {
  const router = useRouter();
  const formId = useId();

  const [checkIn, setCheckIn] = useState(defaultCheckIn());
  const [checkOut, setCheckOut] = useState(defaultCheckOut());
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestsOpen, setGuestsOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const href = buildBookingHref({
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      children: children > 0 ? children : undefined,
    });

    router.push(href);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-2 rounded-3xl bg-white p-3 text-ink shadow-2xl sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_auto] lg:items-center lg:rounded-full lg:p-3 lg:pl-6"
    >
      <div className="flex items-center gap-3 px-3 py-1 lg:border-r lg:pr-6">
        <CalendarDays className="size-5 shrink-0 text-ink/70" aria-hidden />
        <div className="grid min-w-0 flex-1">
          <Label htmlFor={`${formId}-checkin`} className="text-xs font-normal text-ink/60">
            Заезд
          </Label>
          <Input
            id={`${formId}-checkin`}
            type="date"
            required
            value={checkIn}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setCheckIn(e.target.value)}
            className={fieldInputClass}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-1 lg:border-r lg:pr-6">
        <CalendarDays className="size-5 shrink-0 text-ink/70" aria-hidden />
        <div className="grid min-w-0 flex-1">
          <Label htmlFor={`${formId}-checkout`} className="text-xs font-normal text-ink/60">
            Выезд
          </Label>
          <Input
            id={`${formId}-checkout`}
            type="date"
            required
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className={fieldInputClass}
          />
        </div>
      </div>

      <div className="relative px-3 py-1 sm:col-span-2 lg:col-span-1">
        <button
          type="button"
          aria-expanded={guestsOpen}
          aria-controls={`${formId}-guests`}
          onClick={() => setGuestsOpen((open) => !open)}
          className="flex w-full items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <User className="size-5 shrink-0 text-ink/70" aria-hidden />
          <span className="grid flex-1">
            <span className="text-xs text-ink/60">Гости</span>
            <span className="text-base font-semibold">{guestsLabel(adults, children)}</span>
          </span>
          <ChevronDown
            className={`size-4 shrink-0 transition-transform ${guestsOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>

        {guestsOpen && (
          <div
            id={`${formId}-guests`}
            className="absolute bottom-full left-0 z-30 mb-3 grid w-72 max-w-[calc(100vw-2rem)] gap-4 rounded-2xl border bg-white p-4 shadow-xl"
          >
            <Stepper label="Взрослые" value={adults} min={1} max={10} onChange={setAdults} />
            <Stepper label="Дети" value={children} min={0} max={10} onChange={setChildren} />
            <Button type="button" size="sm" className="rounded-full" onClick={() => setGuestsOpen(false)}>
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
    </form>
  );
}
