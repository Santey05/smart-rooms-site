import { hotel, phoneHref, UNKNOWN_LABEL } from "@/content/site";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[12rem_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

const unknown = <span className="text-muted-foreground">{UNKNOWN_LABEL}</span>;

/** Контакты отеля из src/content/site.ts (используется на главной и в /contacts). */
export function ContactList() {
  return (
    <dl className="grid gap-3">
      <Row label="Адрес">{hotel.address ?? unknown}</Row>
      <Row label="Телефон">
        {hotel.phone ? (
          <a href={phoneHref(hotel.phone)} className="underline underline-offset-4">
            {hotel.phone}
          </a>
        ) : (
          unknown
        )}
      </Row>
      <Row label="Email">
        {hotel.email ? (
          <a href={`mailto:${hotel.email}`} className="underline underline-offset-4">
            {hotel.email}
          </a>
        ) : (
          unknown
        )}
      </Row>
      <Row label="Ресепшен">{hotel.receptionHours ?? unknown}</Row>
    </dl>
  );
}
