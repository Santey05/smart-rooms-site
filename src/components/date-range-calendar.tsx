"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { ru } from "react-day-picker/locale";

import { cn } from "@/lib/utils";

/**
 * Календарь выбора заезда/выезда в стиле сайта (тот же вид, что у панели
 * гостей). Ничего не проверяет, кроме «нельзя выбрать прошедшую дату» —
 * доступность дат проверяет модуль Bnovo (CLAUDE.md 4.1).
 */
export function DateRangeCalendar({
  range,
  onRangeChange,
  today,
  numberOfMonths,
}: {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  today: Date;
  numberOfMonths: number;
}) {
  function handleDayClick(day: Date) {
    // Нет начала или диапазон уже выбран — начинаем выбор заново с этой даты.
    // Выезд должен быть позже заезда, поэтому клик по той же/более ранней дате
    // тоже начинает новый выбор.
    if (!range?.from || range.to || day <= range.from) {
      onRangeChange({ from: day, to: undefined });
      return;
    }
    onRangeChange({ from: range.from, to: day });
  }

  return (
    <DayPicker
      mode="range"
      locale={ru}
      weekStartsOn={1}
      numberOfMonths={numberOfMonths}
      defaultMonth={range?.from ?? today}
      startMonth={today}
      disabled={{ before: today }}
      selected={range}
      // Жёлтые состояния задаём сами (а не через range_* библиотеки): пока выбран
      // только заезд, библиотека не помечает день как начало диапазона.
      // Подложка-«капсула» появляется, только когда выбран и выезд.
      modifiers={{
        stayStart: range?.from ?? false,
        stayEnd: range?.to ?? false,
        stayMiddle:
          range?.from && range.to ? { after: range.from, before: range.to } : false,
      }}
      modifiersClassNames={{
        stayStart: cn(dayCap, range?.to && "rounded-l-full bg-sun/30"),
        stayEnd: cn(dayCap, "rounded-r-full bg-sun/30"),
        stayMiddle: "bg-sun/30",
      }}
      // Управляем выбором сами: игнорируем диапазон, который считает библиотека,
      // и берём только дату клика (второй аргумент).
      onSelect={(_next, triggerDate) => handleDayClick(triggerDate)}
      classNames={{
        root: "relative",
        months: "relative flex flex-col gap-6 sm:flex-row",
        month: "grid gap-3",
        month_caption: "flex h-8 items-center justify-center",
        caption_label: "font-semibold capitalize",
        nav: "absolute inset-x-0 top-0 flex h-8 items-center justify-between",
        button_previous: navButton,
        button_next: navButton,
        month_grid: "border-collapse",
        weekday: "size-10 text-xs font-normal text-ink/50",
        day: "p-0 text-center",
        day_button:
          "size-10 cursor-pointer rounded-full text-sm font-medium tabular-nums outline-none transition-colors hover:bg-ink/10 focus-visible:ring-2 focus-visible:ring-ring/60",
        // Дни соседних месяцев не показываем, вместе с подложкой диапазона.
        outside: "invisible",
        hidden: "invisible",
        disabled:
          "[&>button]:cursor-not-allowed [&>button]:opacity-30 [&>button]:hover:bg-transparent",
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" aria-hidden />
          ) : (
            <ChevronRight className="size-4" aria-hidden />
          ),
      }}
    />
  );
}

const navButton =
  "flex size-8 cursor-pointer items-center justify-center rounded-full border transition-colors hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ring/60 outline-none disabled:cursor-not-allowed disabled:opacity-30";

// Заезд/выезд: жёлтый кружок.
const dayCap = "[&>button]:bg-sun [&>button]:font-bold";
