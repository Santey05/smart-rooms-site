"use client";

import { CalendarDays, ChevronDown, Minus, Plus, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { DateRange } from "react-day-picker";

import { DateRangeCalendar } from "@/components/date-range-calendar";
import { Button } from "@/components/ui/button";
import { hotel } from "@/content/site";
import { buildBookingHref, MIN_CHILD_AGE, MAX_CHILD_AGE } from "@/lib/booking";
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
 * (раздел 9). Блок «время заезда/выезда» из раздела 6.5 тоже не перенесён:
 * в самом модуле Bnovo такого блока нет, и site.ts эти часы дублировать не
 * должен — источник правды для гостя один, модуль на /booking.
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
  "absolute right-0 top-full z-30 mt-3 scroll-mb-20 lg:scroll-mb-4 max-w-[calc(100vw-2rem)] rounded-2xl border border-glass-border bg-neva p-4 text-white shadow-2xl";

function useIsWide(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
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
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={`${label}: ${value ? value.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", weekday: "long" }) : "не выбрано"}`}
      onClick={onClick}
      className={cn(dateFieldClass, open && "bg-[rgba(16,24,32,0.7)]")}
    >
      <CalendarDays className="size-5 shrink-0 text-granite" aria-hidden />
      <span className="min-w-0 flex-1 text-white">
        <span className="block text-[11px] leading-tight text-granite">{label}</span>
        <span className="block truncate text-[15px] font-medium">{formatDateShort(value)}</span>
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
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const wide = useIsWide();

  // today фиксируем один раз на монтирование, чтобы календарь не «прыгал».
  const [today] = useState(startOfToday);
  // undefined на первом рендере — совпадает с тем, что видит сервер. Страница
  // собирается статически, и если вычислять «сегодня+1/+2» прямо здесь, эти
  // даты застынут на моменте сборки: у гостя, открывшего сайт хоть днём
  // позже, при гидратации получится расхождение (React честно ловит это как
  // ошибку гидратации — «сегодня» на сервере и на клиенте разное). Даты по
  // умолчанию выставляются ниже в useEffect — уже после гидратации, обычным
  // обновлением состояния, а не частью SSR-рендера.
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [adults, setAdults] = useState(1);
  const [childAges, setChildAges] = useState<Array<number | null>>([]);
  const children = childAges.length;
  const hasChildAges = childAges.every((age) => age !== null);
  const [open, setOpen] = useState<OpenPanel>(null);
  const [dateField, setDateField] = useState<"checkIn" | "checkOut">("checkIn");

  // Значение зависит от Date и должно появиться уже после гидратации, не
  // участвуя в сверке сервер/клиент (см. комментарий у range выше) — «лишний
  // ре-рендер», от которого предостерегает правило ниже, тут и есть цель.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRange({ from: addDays(startOfToday(), 1), to: addDays(startOfToday(), 2) });
  }, []);

  // Немодальные панели: фокус внутри при открытии, свободный выход по Tab.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const initialFocus = panel?.querySelector<HTMLButtonElement>(
      '[data-selected="true"] button:not([disabled]):not([aria-disabled="true"])',
    ) ?? panel?.querySelector<HTMLButtonElement>('[data-day] button:not([disabled]):not([aria-disabled="true"])')
      ?? panel?.querySelector<HTMLButtonElement>('button:not([disabled]):not([aria-disabled="true"])');
    initialFocus?.focus({ preventScroll: true });
    panel?.scrollIntoView({ block: "nearest", behavior: "instant" });

    function onPointerDown(event: PointerEvent) {
      if (!formRef.current?.contains(event.target as Node)) setOpen(null);
    }
    function onFocusIn(event: FocusEvent) {
      if (!panel?.contains(event.target as Node) && event.target !== triggerRef.current) {
        setOpen(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(null);
        triggerRef.current?.focus({ preventScroll: true });
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, dateField]);

  // Список возрастов может увеличить высоту уже открытой панели.
  useEffect(() => {
    if (open === "guests") panelRef.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [open, children]);

  function setChildren(count: number) {
    setChildAges((current) => count <= current.length
      ? current.slice(0, count)
      : [...current, ...Array<number | null>(count - current.length).fill(null)]);
  }

  function closePanel() {
    setOpen(null);
    triggerRef.current?.focus({ preventScroll: true });
  }

  function toggleDates(field: "checkIn" | "checkOut", trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setDateField(field);
    setOpen(open === "dates" && dateField === field ? null : "dates");
  }

  function toggleGuests(trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setOpen((current) => (current === "guests" ? null : "guests"));
  }

  const hasDates = Boolean(range?.from && range.to);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Без обеих дат переходить в модуль рано — просим выбрать даты.
    if (!range?.from || !range.to) {
      setOpen("dates");
      return;
    }

    if (!childAges.every((age): age is number => age !== null)) {
      setOpen("guests");
      return;
    }

    router.push(
      buildBookingHref({
        checkIn: range.from,
        checkOut: range.to,
        adults,
        children: childAges,
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
          open={open === "dates" && dateField === "checkIn"}
          controls={datesPanelId}
          onClick={(event) => toggleDates("checkIn", event.currentTarget)}
        />
        <DateField
          label="Выезд"
          value={range?.to}
          open={open === "dates" && dateField === "checkOut"}
          controls={datesPanelId}
          onClick={(event) => toggleDates("checkOut", event.currentTarget)}
        />
      </div>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open === "guests"}
          aria-controls={guestsPanelId}
          aria-label={`Гости: ${guestsLabel(adults, children)}${hasChildAges ? "" : ", укажите возраст детей"}`}
          onClick={(event) => toggleGuests(event.currentTarget)}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-xl bg-field-bg px-4 py-3 text-left transition-colors outline-none hover:bg-[rgba(16,24,32,0.7)] focus-visible:ring-2 focus-visible:ring-white/50",
            open === "guests" && "bg-[rgba(16,24,32,0.7)]",
          )}
        >
          <span className="flex items-center gap-2">
            <User className="size-4 shrink-0 text-granite" aria-hidden />
            <span className="text-[15px] font-medium text-white">
              {guestsLabel(adults, children)}
              {!hasChildAges && <span className="block text-xs text-lantern">Укажите возраст детей</span>}
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
            ref={panelRef}
            id={guestsPanelId}
            role="dialog"
            aria-label="Выбор гостей"
            className={cn(panelClass, "grid max-h-[min(32rem,calc(100dvh-7rem))] w-72 gap-4 overflow-y-auto")}
          >
            <Stepper label="Взрослые" value={adults} min={1} max={10} onChange={setAdults} />
            <Stepper label="Дети" value={children} min={0} max={10} onChange={setChildren} />
            {children > 0 && (
              <div className="grid gap-3 border-t border-white/20 pt-3">
                <p className="text-xs text-granite">Укажите возраст каждого ребёнка: от 6 до 17 лет.</p>
                {childAges.map((age, index) => (
                  <label key={index} className="grid gap-1.5 text-sm">
                    Возраст ребёнка {index + 1}
                    <select
                      required
                      value={age ?? ""}
                      onChange={(event) => {
                        const nextAge = Number(event.currentTarget.value);
                        setChildAges((current) => current.map((value, i) => i === index ? nextAge : value));
                      }}
                      className="h-11 w-full rounded-lg border border-white/20 bg-neva px-3 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      <option value="" disabled>Выберите возраст</option>
                      {Array.from({ length: MAX_CHILD_AGE - MIN_CHILD_AGE + 1 }, (_, i) => MIN_CHILD_AGE + i).map((years) => (
                        <option key={years} value={years}>
                          {years} {plural(years, "год", "года", "лет")}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              className="rounded-lg"
              onClick={closePanel}
              disabled={!hasChildAges}
            >
              Готово
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          disabled={!hasDates || !hasChildAges}
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
          ref={panelRef}
          id={datesPanelId}
          role="dialog"
          aria-label="Выбор дат"
          className={cn(panelClass, "grid gap-4")}
        >
          <p className="text-sm font-medium" aria-live="polite">
            {dateField === "checkIn" ? "Выберите дату заезда" : "Выберите дату выезда"}
          </p>
          <DateRangeCalendar
            key={dateField}
            field={dateField}
            onCheckInSelected={() => setDateField("checkOut")}
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
            onClick={closePanel}
          >
            Готово
          </Button>
        </div>
      )}
    </form>
  );
}
