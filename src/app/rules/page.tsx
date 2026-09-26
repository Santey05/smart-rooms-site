import type { Metadata } from "next";

import { hotel, stayRules, UNKNOWN_LABEL } from "@/content/site";

export const metadata: Metadata = {
  title: "Правила проживания",
  description: "Время заезда и выезда, правила проживания в мини-отеле «Смарт румс».",
};

export default function RulesPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Правила проживания</h1>

      <dl className="grid gap-3">
        <div className="grid gap-1 sm:grid-cols-[12rem_1fr]">
          <dt className="text-muted-foreground">Заезд</dt>
          <dd>{hotel.checkInTime ?? UNKNOWN_LABEL}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[12rem_1fr]">
          <dt className="text-muted-foreground">Выезд</dt>
          <dd>{hotel.checkOutTime ?? UNKNOWN_LABEL}</dd>
        </div>
      </dl>

      {stayRules.length > 0 ? (
        <ol className="grid gap-4">
          {stayRules.map((rule) => (
            <li key={rule.title} className="grid gap-1">
              <h2 className="font-medium">{rule.title}</h2>
              <p className="text-muted-foreground">{rule.text}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-muted-foreground">
          Подробные правила проживания скоро появятся на этой странице.
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        Условия отмены и возврата зависят от выбранного тарифа и показываются
        в модуле бронирования.
      </p>
    </main>
  );
}
