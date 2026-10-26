"use client";

import { ArrowRight, Footprints } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { HotelMap, ICON_COMPONENTS, MetroGlyph } from "@/components/brand/hotel-map";
import { CATEGORY_LABEL, CITY_MAP_POINTS, routeHref, type MapPointId } from "@/content/city-map";
import { DEFAULT_PLACE_ID, PLACES } from "@/content/places";
import { hotel } from "@/content/site";

// Сначала редакционные места, затем точки, у которых пока нет фото и рассказа.
const EXPLORER_POINTS = [
  ...PLACES,
  ...CITY_MAP_POINTS.filter((point) => !PLACES.some((place) => place.id === point.id)),
];

function ShortFact({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-t border-white/10 pt-4">
      <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}
        className="flex min-h-11 items-center gap-2 text-sm font-medium text-white transition-colors hover:text-lantern">
        Подробнее
        <ArrowRight className={`size-4 transition-transform ${expanded ? "rotate-90" : ""}`} aria-hidden />
      </button>
      {expanded && <p className="mt-3 text-sm text-white/70">{text}</p>}
    </div>
  );
}

/** Карточка, переключатель и карта используют один selectedId и общие данные точки. */
export function PetersburgExplorer() {
  const [selectedId, setSelectedId] = useState<MapPointId>(DEFAULT_PLACE_ID);
  const point = CITY_MAP_POINTS.find((item) => item.id === selectedId)!;
  const place = PLACES.find((item) => item.id === selectedId);
  const Icon = point.icon !== "metro" ? ICON_COMPONENTS[point.icon] : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Петербург начинается здесь</h2>
        <p className="font-accent max-w-xl text-xl text-muted-foreground italic">Куда пойдём от Марата, 30?</p>
      </div>
      <style>{`
        @keyframes pgxFadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pgx-fade { animation: pgxFadeSlide 0.35s ease; }
        @media (prefers-reduced-motion: reduce) {
          .pgx-fade { animation: none; }
        }
      `}</style>
      <div className="overflow-hidden rounded-[24px] border border-border bg-neva text-white">
        <div className="grid lg:grid-cols-[1.6fr_1fr]">
          <div key={`${point.id}-photo`} className="pgx-fade relative h-[280px] min-w-0 sm:h-[380px] lg:h-[480px]">
            {place ? (
              <>
                <Image src={place.image} alt={place.imageAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                <a href={place.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white/80 backdrop-blur-sm transition-colors hover:text-white">
                  Фото: {place.author} · {place.license}
                </a>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-5 bg-gradient-to-br from-neva to-slate-700">
                {Icon && <Icon className="size-24 text-lantern" aria-hidden />}
                <p className="text-sm text-white/70">Маршрут от отеля</p>
              </div>
            )}
          </div>
          <div key={`${point.id}-info`} className="pgx-fade flex min-w-0 flex-col gap-4 p-6 sm:p-8 lg:justify-center">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-lantern/50">
                {Icon ? <Icon width={14} height={14} color="#E9A55B" strokeWidth={2.25} /> : <MetroGlyph className="size-[14px]" />}
              </span>
              <span className="min-w-0 truncate text-sm text-white/60">{CATEGORY_LABEL[point.icon]}</span>
            </div>
            <h3 aria-live="polite" className="min-w-0 break-words text-3xl leading-[1.05] font-bold sm:text-4xl">{point.name}</h3>
            <p className="flex min-w-0 items-center gap-2 text-lantern">
              <Footprints className="size-4 shrink-0" aria-hidden />
              <span className="min-w-0">{point.minutes} мин пешком от {hotel.address?.replace("Санкт-Петербург, ул. ", "")}</span>
            </p>
            <p className="text-white/70">{place?.description ?? "Посмотрите пешеходный маршрут от отеля на Яндекс.Картах."}</p>
            {place?.shortFact && <ShortFact key={point.id} text={place.shortFact} />}
            <a href={routeHref(point)} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium text-lantern underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lantern">
              Маршрут пешком <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
        <nav aria-label="Выбор места" className="border-t border-white/10 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap gap-x-7 gap-y-3 lg:justify-between">
            {EXPLORER_POINTS.map((item) => (
              <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} aria-pressed={item.id === selectedId}
                className={`min-h-11 shrink-0 border-b-2 pb-1 text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lantern ${item.id === selectedId
                  ? "border-lantern font-semibold text-white"
                  : "border-transparent text-white/50 hover:border-lantern/60 hover:text-white"}`}>
                {item.name}
              </button>
            ))}
          </div>
        </nav>
        <HotelMap activeId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );
}
