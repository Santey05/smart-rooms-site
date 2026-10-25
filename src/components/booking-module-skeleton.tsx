/** Каркас загрузки без данных о номерах и ценах — источник этих данных Bnovo. */
export function BookingModuleSkeleton() {
  return (
    <div role="status" aria-label="Загружаем модуль бронирования" className="grid gap-5 py-4">
      <span className="sr-only">Загружаем модуль бронирования…</span>
      <div aria-hidden="true" className="grid gap-5 motion-safe:animate-pulse">
        <div className="grid gap-3 rounded-2xl border border-border bg-background/60 p-4 sm:grid-cols-3 sm:p-5">
          {[0, 1, 2].map((field) => (
            <div key={field} className="grid gap-2">
              <div className="h-2.5 w-14 rounded-full bg-border" />
              <div className="h-11 rounded-lg bg-muted" />
            </div>
          ))}
        </div>
        {[0, 1].map((card) => (
          <div key={card} className="overflow-hidden rounded-2xl border border-border sm:grid sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="h-36 bg-muted sm:h-full sm:min-h-48" />
            <div className="grid content-start gap-4 p-5 sm:p-6">
              <div className="h-4 w-3/5 rounded-full bg-border" />
              <div className="grid gap-2">
                <div className="h-2.5 w-full rounded-full bg-muted" />
                <div className="h-2.5 w-4/5 rounded-full bg-muted" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-12 rounded-full bg-muted" />
                <div className="h-6 w-16 rounded-full bg-muted" />
                <div className="h-6 w-10 rounded-full bg-muted" />
              </div>
              <div className="mt-2 h-10 w-32 rounded-lg bg-border sm:justify-self-end" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
