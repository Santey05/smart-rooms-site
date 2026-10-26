import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

import { hotel, phoneHref, stayRules, UNKNOWN_LABEL } from "@/content/site";

export const metadata: Metadata = pageMetadata("Правила проживания", "Время заезда и выезда, правила проживания в мини-отеле «Смарт румс».", "/rules");

export default function RulesPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Правила проживания</h1>
      <dl className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="text-muted-foreground">Заезд</dt>
          <dd>{hotel.checkInTime ?? UNKNOWN_LABEL}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="text-muted-foreground">Выезд</dt>
          <dd>{hotel.checkOutTime ?? UNKNOWN_LABEL}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="text-muted-foreground">Заселение</dt>
          <dd>{hotel.checkInMethod ?? UNKNOWN_LABEL}</dd>
        </div>
      </dl>
      <nav aria-label="Разделы правил проживания" className="flex flex-wrap gap-2">
        {stayRules.map((rule, index) => (
          <a key={rule.title} href={`#stay-rule-${index + 1}`}
            className="inline-flex min-h-11 max-w-full items-center rounded-lg border border-border px-3 py-2 text-sm hover:bg-card focus-visible:outline-2 focus-visible:outline-lantern">
            {rule.title}
          </a>
        ))}
      </nav>
      <div className="grid gap-10">
        {stayRules.map((rule, index) => (
          <section key={rule.title} id={`stay-rule-${index + 1}`} aria-labelledby={`stay-rule-title-${index + 1}`} className="grid scroll-mt-6 gap-4">
            <h2 id={`stay-rule-title-${index + 1}`} className="text-xl font-semibold">{rule.title}</h2>
            {rule.paragraphs.map((paragraph) => (
              <div key={paragraph.number} className="grid gap-3 text-muted-foreground">
                <p className="leading-relaxed"><span className="font-medium text-foreground">{paragraph.number}</span> {paragraph.text}</p>
                {paragraph.items && (
                  <ul className="list-disc space-y-3 pl-5 leading-relaxed marker:text-lantern">
                    {paragraph.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
      <p className="border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
        Условия отмены и возврата зависят от выбранного тарифа и показываются в модуле бронирования.
      </p>
      <section aria-labelledby="rules-contact" className="grid gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h2 id="rules-contact" className="font-semibold">Связаться с администрацией</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {hotel.phone && <a href={phoneHref(hotel.phone)} className="inline-flex min-h-11 items-center underline underline-offset-4">{hotel.phone}</a>}
          {hotel.email && <a href={`mailto:${hotel.email}`} className="inline-flex min-h-11 items-center break-all underline underline-offset-4">{hotel.email}</a>}
        </div>
      </section>
    </main>
  );
}
