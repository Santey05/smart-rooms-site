"use client";

import { ArrowRight, Footprints } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { HotelMap, ICON_COMPONENTS, MetroGlyph } from "@/components/brand/hotel-map";
import { CATEGORY_LABEL, type MapPointId } from "@/content/city-map";
import { DEFAULT_PLACE_ID, PLACES } from "@/content/places";
import { hotel } from "@/content/site";

/**
 * «Петербург вокруг вас» — редакционный блок «одно место за раз» над
 * Яндекс-картой: большое фото + короткий рассказ об одном выбранном месте,
 * компактный переключатель мест и та же карта (src/components/brand/
 * hotel-map.tsx), что и раньше — карта управляемая (activeId/onSelect),
 * поэтому выбор места здесь двигает карту, а клик по маркеру на карте
 * обновляет историю и фото. Общее состояние — один selectedId, от него
 * зависит всё (фото/текст/время/активный пункт/активный маркер).
 *
 * selectedId типизирован как MapPointId (шире, чем PlaceId в
 * src/content/places.ts), потому что на карте есть точки без редакционного
 * контента (например, Рубинштейна — добавлена только на карту, своего
 * рассказа с фото у неё нет). Клик по такой точке всё равно двигает карту
 * и подсвечивает нижнюю панель, но большой блок с фото продолжает
 * показывать последнее выбранное место с контентом — не падает и не
 * показывает пустоту.
 *
 * Стиль блока (чат, 2026-10-01, третья итерация) — тёмная карточка на всю
 * ширину по присланному референсу: фото без отступов слева, справа
 * категория + заголовок + время + текст + разворачиваемое «Подробнее»
 * (раскрывает place.shortFact, не всегда видимый текст). Вкладки выбора
 * места — отдельной полосой внизу той же карточки, вровень на всю ширину.
 */

function ShortFact({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-t border-white/10 pt-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-lantern"
      >
        Подробнее
        <ArrowRight className={`size-4 transition-transform ${expanded ? "rotate-90" : ""}`} aria-hidden />
      </button>
      {expanded && <p className="mt-3 text-sm text-white/70">{text}</p>}
    </div>
  );
}

export function PetersburgExplorer() {
  const [selectedId, setSelectedId] = useState<MapPointId>(DEFAULT_PLACE_ID);
  const place = PLACES.find((p) => p.id === selectedId) ?? PLACES.find((p) => p.id === DEFAULT_PLACE_ID)!;
  const Icon = place.icon !== "metro" ? ICON_COMPONENTS[place.icon] : null;

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
          <div
            key={`${place.id}-photo`}
            className="pgx-fade relative h-[280px] min-w-0 sm:h-[380px] lg:h-[480px]"
          >
            <Image
              src={place.image}
              alt={place.imageAlt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <a
              href={place.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white/80 backdrop-blur-sm transition-colors hover:text-white"
            >
              Фото: {place.author} · {place.license}
            </a>
          </div>

          <div key={`${place.id}-info`} className="pgx-fade flex min-w-0 flex-col gap-4 p-6 sm:p-8 lg:justify-center">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-lantern/50">
                {Icon ? <Icon width={14} height={14} color="#E9A55B" strokeWidth={2.25} /> : <MetroGlyph className="size-[14px]" />}
              </span>
              <span className="min-w-0 truncate text-sm text-white/60">{CATEGORY_LABEL[place.icon]}</span>
            </div>

            <h3 className="min-w-0 text-4xl leading-[1.05] font-bold">{place.name}</h3>

            <p className="flex min-w-0 items-center gap-2 text-lantern">
              <Footprints className="size-4 shrink-0" aria-hidden />
              <span className="min-w-0">
                {place.minutes} мин пешком от {hotel.address?.replace("Санкт-Петербург, ул. ", "")}
              </span>
            </p>

            <p className="text-white/70">{place.description}</p>

            {place.shortFact && <ShortFact key={place.id} text={place.shortFact} />}
          </div>
        </div>

        <nav aria-label="Выбор места" className="border-t border-white/10 px-6 py-5 sm:px-8">
          <div className="flex flex-wrap gap-x-7 gap-y-3 lg:justify-between">
            {PLACES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                aria-current={p.id === selectedId}
                className={`shrink-0 border-b-2 pb-1 text-sm whitespace-nowrap transition-colors ${
                  p.id === selectedId
                    ? "border-lantern font-semibold text-white"
                    : "border-transparent text-white/50 hover:border-lantern/60 hover:text-white"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </nav>

        <HotelMap activeId={selectedId} onSelect={setSelectedId} />
      </div>
    </div>
  );
}
