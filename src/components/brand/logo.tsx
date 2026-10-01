import { cn } from "@/lib/utils";
import { hotel } from "@/content/site";

/**
 * Решено (чат, 2026-10-01): без иконки-знака, только надпись — несколько
 * вариантов значка (окно, ключ, табличка, мост, крыша) не понравились.
 * Разделитель и двухстрочный тег «Мини-отель на Марата, 30» — без своего
 * фона, просто буквы и полоса; цвет наследуется от родителя (currentColor),
 * поэтому одинаково читается и на тёмном хиро, и на светлой шапке.
 */
export function LogoWordmark({ className }: { className?: string }) {
  const tagline = hotel.address?.replace("Санкт-Петербург, ул. ", "на ");

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="text-lg leading-none font-bold tracking-wide uppercase">Смарт румс</span>
      {/* На узких экранах тег-лайну не хватает места — он сминается в
          колонку из однословных строк (см. чат, 2026-10-01). Проще и
          надёжнее скрыть его до sm, чем ужимать текст до нечитаемого. */}
      <span className="hidden items-center gap-3 sm:flex">
        <span className="h-7 w-px shrink-0 bg-current opacity-25" aria-hidden />
        <span className="flex flex-col text-[11px] leading-[1.35] whitespace-nowrap opacity-60">
          <span>Мини-отель</span>
          {tagline && <span>{tagline}</span>}
        </span>
      </span>
    </span>
  );
}
