import { cn } from "@/lib/utils";

/**
 * Знак — контур петербургского арочного окна с тёплой точкой света внутри
 * (раздел 6.1 спецификации). Абстрактный, не воспроизводит герб или чужой
 * символ.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 26" aria-hidden className={cn("h-[26px] w-[22px] shrink-0", className)}>
      <path
        d="M1 25V11.5C1 5.7 5.5 1 11 1s10 4.7 10 10.5V25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="11" cy="12.5" r="2.4" className="fill-lantern" />
    </svg>
  );
}

/** Логотип для навигации: знак + название. */
export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-[22px] leading-none font-normal">Смарт румс</span>
    </span>
  );
}
