import { hotel } from "@/content/site";
import { landmarks } from "@/content/neighborhood";

/**
 * Стилизованная радиальная схема «что рядом» вместо карточек с фото
 * (заменяет прежний блок в «Об отеле» — см. чат: точную карту улиц модель
 * нарисовать не может, а придуманная геометрия вводит гостя в заблуждение).
 * Направления и время — реальные факты из src/content/neighborhood.ts,
 * а не декоративный рисунок.
 *
 * Все ориентиры лежат в секторе СЗ–С от отеля (реальная геометрия города),
 * поэтому схема физически лопастная: точки и подписи — слева и сверху,
 * подпись отеля — снизу, в свободном секторе.
 */

const VIEW_W = 440;
const VIEW_H = 460;
const CX = 300;
const CY = 230;
const R_MIN = 58;
const R_MAX = 178;
const MIN_MINUTES = 5;
const MAX_MINUTES = 30;

function radiusFor(minutes: number): number {
  const t = (minutes - MIN_MINUTES) / (MAX_MINUTES - MIN_MINUTES);
  return R_MIN + t * (R_MAX - R_MIN);
}

function pointAt(bearingDeg: number, radius: number) {
  const rad = (bearingDeg * Math.PI) / 180;
  return { x: CX + radius * Math.sin(rad), y: CY - radius * Math.cos(rad) };
}

// Ручная подстройка подписи под конкретный набор ориентиров (Думская и
// Казанский собор лежат почти на одном луче и иначе наезжают друг на
// друга). Точка на схеме всегда стоит на честном азимуте/расстоянии —
// подстраивается только положение текста рядом с ней.
const LABEL_TUNING: Record<string, { extraR: number; dy: number }> = {
  "Невский проспект": { extraR: 18, dy: -2 },
  "Думская улица": { extraR: 12, dy: 18 },
  "Казанский собор": { extraR: 24, dy: -16 },
};

export function NeighborhoodMap() {
  const homeLabel = hotel.address?.replace("Санкт-Петербург, ", "") ?? hotel.name;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={`Схема расположения: ${hotel.name}, ${homeLabel}, и время пешком до ближайших ориентиров — ${landmarks
        .map((l) => `${l.name} ${l.minutes} мин`)
        .join(", ")}`}
      className="h-full w-full"
    >
      {/* Компас — декоративный, но честный ориентир по сторонам света */}
      <text x={CX} y={CY - R_MAX - 22} textAnchor="middle" className="fill-granite text-[12px]">
        С
      </text>
      <path d={`M${CX} ${CY - R_MAX - 15} l-4 8 h8 z`} className="fill-granite" />

      {/* Радиальные направляющие кольца — декоративные */}
      {[R_MIN + (R_MAX - R_MIN) * 0.33, R_MIN + (R_MAX - R_MIN) * 0.66, R_MAX].map((r) => (
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
        const r = radiusFor(landmark.minutes);
        const p = pointAt(landmark.bearingDeg, r);
        const tuning = LABEL_TUNING[landmark.name] ?? { extraR: 20, dy: 0 };
        const label = pointAt(landmark.bearingDeg, r + tuning.extraR);
        const labelX = label.x;
        const labelY = label.y + tuning.dy;
        const anchor = labelX < CX ? "end" : "start";

        return (
          <g key={landmark.name}>
            <line x1={CX} y1={CY} x2={p.x} y2={p.y} className="stroke-white/15" strokeWidth="1" />
            <circle cx={p.x} cy={p.y} r="4" className="fill-white stroke-neva" strokeWidth="1.5" />
            <text x={labelX} y={labelY} textAnchor={anchor} className="fill-white text-[13px] font-medium">
              {landmark.name}
            </text>
            <text x={labelX} y={labelY + 14} textAnchor={anchor} className="fill-granite text-[12px]">
              {landmark.minutes} мин пешком
            </text>
          </g>
        );
      })}

      {/* Отель — единственная тёплая точка на схеме, в свободном южном секторе */}
      <circle cx={CX} cy={CY} r="14" className="fill-lantern/20" />
      <circle cx={CX} cy={CY} r="6" className="fill-lantern" />
      <text x={CX} y={CY + 32} textAnchor="middle" className="fill-white text-[14px] font-semibold">
        {hotel.name}
      </text>
      <text x={CX} y={CY + 48} textAnchor="middle" className="fill-granite text-[12px]">
        {homeLabel}
      </text>
    </svg>
  );
}
