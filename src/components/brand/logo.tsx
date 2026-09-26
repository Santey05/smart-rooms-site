import { cn } from "@/lib/utils";

/** Жёлтое подчёркивание-«мазок» под рукописным текстом. */
export function BrushUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 14"
      preserveAspectRatio="none"
      aria-hidden
      className={cn("h-3 w-full text-sun", className)}
    >
      <path
        d="M3 9 C 40 3, 90 12, 130 6 S 200 4, 217 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Логотип для шапки: слово + подпись. */
export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="font-hand text-3xl font-bold tracking-wide">Смарт Румс</span>
      <BrushUnderline className="-mt-0.5 h-2 w-14" />
      <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] opacity-80">
        Мини-отель в Санкт-Петербурге
      </span>
    </span>
  );
}

/** Вывеска-табличка («Смарт Румс» на тёмном фоне) — декоративный элемент hero. */
export function LogoSign({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-44 rounded-2xl border border-white/10 bg-ink px-5 py-6 text-center text-cream shadow-2xl",
        className,
      )}
    >
      {/* крепление вывески */}
      <span aria-hidden className="absolute -top-3 left-1/2 h-3 w-px bg-cream/40" />
      <p className="font-hand text-4xl font-bold leading-[0.95]">
        Смарт
        <br />
        Румс
      </p>
      <BrushUnderline className="mx-auto mt-2 h-2 w-24" />
      <p className="mt-3 text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.12em] text-cream/80">
        Мини-отель
        <br />
        Санкт-Петербург
      </p>
    </div>
  );
}
