import { Landmark, MapPin, TrainFront, Wine } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { hotel } from "@/content/site";
import { landmarks } from "@/content/neighborhood";

/**
 * Радиальная схема «что рядом» — заменяет карточки с фото в «Об отеле».
 * Раскладка вдохновлена AI-макетом, который прислал пользователь (иконки,
 * нижняя строка-сводка, курсивная концовка), но пересобрана кодом в
 * бренде сайта: у AI-варианта минимум две цифры расходились с реально
 * проверенными маршрутами (см. чат — Думская улица была указана как
 * 10–12 мин при реальных ~26), и был другой шрифт/палитра/лого.
 *
 * Направления и время — реальные факты из src/content/neighborhood.ts.
 * Точки (пины) стоят на честном азимуте и расстоянии. Подписи — в
 * отдельных фиксированных слотах по кругу с тонкой линией-выноской к
 * пину: у четырёх ориентиров реальный азимут почти совпадает (285–344°,
 * все в секторе З–С), и подписи вдоль настоящего направления накладывались
 * бы друг на друга. Слот меняет только положение ТЕКСТА, не самого пина.
 */

const ICONS: Record<string, LucideIcon> = {
  metro: TrainFront,
  vokzal: TrainFront,
  nevsky: Landmark,
  dumskaya: Wine,
  kazan: Landmark,
};

const VIEW_W = 540;
const VIEW_H = 290;
const CX = 290;
const CY = 210;
const R_MIN = 40;
const R_MAX = 118;
const LABEL_RING = 135;
const MIN_MINUTES = 5;
const MAX_MINUTES = 30;

function radiusFor(minutes: number): number {
  // sqrt — дальние точки разносятся сильнее, чтобы иконки не слипались.
  const t = Math.max(0, (minutes - MIN_MINUTES) / (MAX_MINUTES - MIN_MINUTES));
  return R_MIN + Math.sqrt(t) * (R_MAX - R_MIN);
}

function pointAt(bearingDeg: number, radius: number) {
  const rad = (bearingDeg * Math.PI) / 180;
  return { x: CX + radius * Math.sin(rad), y: CY - radius * Math.cos(rad) };
}

// Слот подписи: только для читаемости текста, не меняет положение пина.
const LABEL_SLOT: Record<string, number> = {
  metro: 272,
  dumskaya: 298,
  kazan: 323,
  nevsky: 350,
  vokzal: 70,
};

export function NeighborhoodMap() {
  const homeLabel = hotel.address?.replace("Санкт-Петербург, ", "") ?? hotel.name;

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-10 sm:px-10 sm:py-14">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-granite">
          {hotel.name} · мини-отель в Санкт-Петербурге
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Вы в центре Петербурга
        </h2>
        <p className="font-accent mt-2 text-xl text-granite italic">
          Вышли из отеля — и Петербург уже вокруг вас.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-lg">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={`Схема расположения: ${hotel.name}, ${homeLabel}, и время пешком до ближайших ориентиров — ${landmarks
            .map((l) => `${l.name} ${l.minutes} мин`)
            .join(", ")}`}
          className="h-full w-full"
        >
          {/* Компас — декоративный, но честный ориентир по сторонам света */}
          <text x={CX} y={CY - R_MAX - 40} textAnchor="middle" className="fill-granite text-[11px]">
            С
          </text>
          <path d={`M${CX} ${CY - R_MAX - 33} l-4 8 h8 z`} className="fill-granite" />

          {[R_MIN + (R_MAX - R_MIN) * 0.4, R_MIN + (R_MAX - R_MIN) * 0.72, R_MAX].map((r) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              className="stroke-white/10"
              strokeDasharray="2 5"
            />
          ))}

          {landmarks.map((landmark) => {
            const pinR = radiusFor(landmark.minutes);
            const pin = pointAt(landmark.bearingDeg, pinR);
            const slotBearing = LABEL_SLOT[landmark.id] ?? landmark.bearingDeg;
            const label = pointAt(slotBearing, LABEL_RING);
            const anchor = label.x < CX - 4 ? "end" : label.x > CX + 4 ? "start" : "middle";

            return (
              <g key={landmark.id}>
                {/* Честное направление: от отеля до реальной точки */}
                <line x1={CX} y1={CY} x2={pin.x} y2={pin.y} className="stroke-white/15" strokeWidth="1" />
                {/* Выноска: от точки к подписи (если слот сдвинут) */}
                <line
                  x1={pin.x}
                  y1={pin.y}
                  x2={label.x}
                  y2={label.y}
                  className="stroke-white/20"
                  strokeWidth="1"
                  strokeDasharray="1.5 3"
                />
                <circle cx={pin.x} cy={pin.y} r="12" className="fill-neva stroke-lantern" strokeWidth="1.5" />
                <foreignObject x={pin.x - 7} y={pin.y - 7} width="14" height="14">
                  <IconGlyph id={landmark.id} />
                </foreignObject>
                <text x={label.x} y={label.y} textAnchor={anchor} className="fill-white text-[12px] font-medium">
                  {landmark.name}
                </text>
                <text x={label.x} y={label.y + 14} textAnchor={anchor} className="fill-granite text-[11px]">
                  {landmark.minutes} мин пешком
                </text>
              </g>
            );
          })}

          {/* Отель — единственная тёплая точка на схеме */}
          <circle cx={CX} cy={CY} r="16" className="fill-lantern/20" />
          <circle cx={CX} cy={CY} r="8" className="fill-lantern" />
          <text x={CX} y={CY + 34} textAnchor="middle" className="fill-white text-[14px] font-semibold">
            {hotel.name}
          </text>
          <text x={CX} y={CY + 50} textAnchor="middle" className="fill-granite text-[12px]">
            {homeLabel}
          </text>
        </svg>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-8">
        {landmarks.map((landmark) => (
          <div key={landmark.id} className="flex shrink-0 items-center gap-2 text-sm whitespace-nowrap">
            <IconGlyph id={landmark.id} className="size-4 text-lantern" />
            <span className="font-medium text-white">{landmark.name}</span>
            <span className="text-granite">· {landmark.minutes} мин</span>
          </div>
        ))}
      </div>

      <p className="font-accent mt-10 text-center text-xl text-white/90 italic">
        Не нужно ехать в центр. Вы уже в нём.
      </p>
    </div>
  );
}

function IconGlyph({ id, className }: { id: string; className?: string }) {
  const Icon = ICONS[id] ?? MapPin;
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Icon className={className ?? "size-3.5 text-lantern"} strokeWidth={2} />
    </div>
  );
}
