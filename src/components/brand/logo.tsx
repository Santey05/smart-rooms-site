import { cn } from "@/lib/utils";

/** Простой абстрактный знак — не претендует на герб или чужой символ. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7 shrink-0", className)}>
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M16 6.5 Q24.5 12.5 16 25.5 Q7.5 12.5 16 6.5 Z" fill="currentColor" />
    </svg>
  );
}

/** Логотип для шапки/навигации: знак + название. */
export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="text-sun" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight">Смарт Румс</span>
        <span className="mt-0.5 hidden text-[0.6rem] font-medium uppercase tracking-[0.16em] whitespace-nowrap opacity-60 sm:block">
          Мини-отель · СПб
        </span>
      </span>
    </span>
  );
}
