"use client";

import { Bridge, Landmark, Martini, ShoppingBag, Theater, TrainFront } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { CITY_MAP_POINTS, type MapPoint, type MapPointIcon, type MapPointId } from "@/content/city-map";
import { hotel } from "@/content/site";

/**
 * Настоящая интерактивная карта (Yandex Maps JS API 2.1) с собственными
 * маркерами — отель и точки интереса из src/content/city-map.ts. Не
 * стандартные синие/красные метки Яндекса: у каждой точки — иконка Lucide,
 * кроме метро — там своя «М» в кружке, так подписано метро в реальности.
 *
 * Маркер — сырой HTML-шаблон для Yandex templateLayoutFactory (свой формат
 * слоя иконки, не React), поэтому иконки внутри него — не компоненты
 * lucide-react, а инлайновая разметка ICON_PATHS/metroSvg (та же геометрия
 * path'ов, что и в самих lucide-иконках). Для React-рендера (карточка,
 * нижняя панель) используются настоящие компоненты lucide-react.
 *
 * Подложка карты не перекрашивается в тёмную (риск потерять читаемость
 * улиц/подписей из-за инверсии цвета) — только слегка приглушается
 * фильтром, чтобы визуально не спорить с нашими золотыми маркерами; сама
 * карта вторична, маркеры и карточки — первичны.
 *
 * Клик по маркеру не открывает стандартный балун Яндекса — вместо этого
 * маркер вызывает window.__hotelMapSelect(id) (проставлен эффектом ниже),
 * который вызывает onSelect и рисует свою карточку поверх карты. Клик и
 * hover ловятся через placemark.events.add(...), а не через onclick/:hover
 * в разметке шаблона: поверх иконки лежит служебный events-pane карты
 * (обрабатывает драг/hit-test по iconShape) и перехватывает нативные
 * события мыши раньше, чем они дойдут до div.
 *
 * Компонент управляемый (activeId/onSelect приходят снаружи) — карта
 * используется и сама по себе, и как часть редакционного блока
 * «Петербург вокруг вас» (src/components/brand/petersburg-explorer.tsx),
 * где выбор места одновременно двигает и фото, и карту.
 *
 * Нужен свой ключ в NEXT_PUBLIC_YANDEX_MAPS_API_KEY (см. .env.example).
 */

const MAP_ELEMENT_ID = "hotel-map";
const GOLD = "#D9A441";
const NAVY = "#1d2a35";

export const ICON_COMPONENTS: Record<Exclude<MapPointIcon, "metro">, ComponentType<SVGProps<SVGSVGElement>>> = {
  vokzal: TrainFront,
  nevsky: Landmark,
  bar: Martini,
  bridge: Bridge,
  theater: Theater,
  gallery: ShoppingBag,
};

// Та же геометрия path'ов, что в соответствующих lucide-иконках выше —
// нужна как строка для сырого HTML-шаблона маркера (см. комментарий вверху
// файла), а не как React-компонент.
const ICON_PATHS: Record<Exclude<MapPointIcon, "metro">, string[]> = {
  vokzal: [
    "M8 3.1V7a4 4 0 0 0 8 0V3.1",
    "m9 15-1-1",
    "m15 15 1-1",
    "M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z",
    "m8 19-2 3",
    "m16 19 2 3",
  ],
  nevsky: [
    "M10 18v-7",
    "M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z",
    "M14 18v-7",
    "M18 18v-7",
    "M3 22h18",
    "M6 18v-7",
  ],
  bar: ["M12 12 4.207 4.207A.707.707 0 0 1 4.707 3h14.586a.707.707 0 0 1 .5 1.207z", "M12 12v10", "M7 22h10"],
  bridge: [
    "M10 9.728V16",
    "M14 9.728V16",
    "M18 20V4",
    "m22 11-4-4A7.5 7.5 0 0 1 6 7l-4 4",
    "M22 16H2",
    "M6 20V4",
  ],
  theater: [
    "M2 10s3-3 3-8",
    "M22 10s-3-3-3-8",
    "M10 2c0 4.4-3.6 8-8 8",
    "M14 2c0 4.4 3.6 8 8 8",
    "M2 10s2 2 2 5",
    "M22 10s-2 2-2 5",
    "M8 15h8",
    "M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",
    "M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1",
  ],
  gallery: [
    "M16 10a4 4 0 0 1-8 0",
    "M3.103 6.034h17.794",
    "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
  ],
};

// building-complex (lucide "Building2") — для метки отеля.
const HOTEL_ICON_PATHS = [
  "M10 12h4",
  "M10 8h4",
  "M14 21v-3a2 2 0 0 0-4 0v3",
  "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
  "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",
];

function lucideSvg(paths: string[], size: number, strokeWidth: number): string {
  const body = paths.map((d) => `<path d="${d}"/>`).join("");
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${GOLD}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

export function MetroGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.5" stroke={GOLD} strokeWidth="1.8" />
      <path d="M7.5 16V8.3l4.5 5 4.5-5V16" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const METRO_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" stroke="${GOLD}" stroke-width="1.8"/><path d="M7.5 16V8.3l4.5 5 4.5-5V16" stroke="${GOLD}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const HOTEL_PIN_HTML = `
  <div class="hm-pin hm-pin--hotel" style="width:72px;height:72px;">
    ${lucideSvg(HOTEL_ICON_PATHS, 38, 2)}
    <div class="hm-hotel-caption">
      <span class="hm-hotel-caption__name">Смарт румс</span>
      <span class="hm-hotel-caption__addr">Марата, 30</span>
    </div>
  </div>
`;

function pointPinHtml(point: MapPoint): string {
  const iconMarkup = point.icon === "metro" ? METRO_SVG : lucideSvg(ICON_PATHS[point.icon], 23, 2.25);
  return `
    <div
      class="hm-pin"
      data-point-id="${point.id}"
      style="width:40px;height:40px;"
      role="button"
      tabindex="0"
      aria-label="${point.name} — ${point.minutes} минут пешком"
    >
      ${iconMarkup}
    </div>
  `;
}

interface YMapsGeoObjectEvents {
  add: (event: string, handler: () => void) => void;
}

interface YMapsPlacemarkInstance {
  events: YMapsGeoObjectEvents;
}

interface YMapsPlacemark {
  new (
    coords: [number, number],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): YMapsPlacemarkInstance;
}

interface YMapsMap {
  geoObjects: { add: (obj: unknown) => void };
  setBounds: (bounds: [[number, number], [number, number]], options?: Record<string, unknown>) => void;
  setCenter: (coords: [number, number], zoom?: number, options?: Record<string, unknown>) => void;
  destroy: () => void;
}

interface YMapsNamespace {
  ready: (callback: () => void) => void;
  Map: new (element: string, state: Record<string, unknown>) => YMapsMap;
  Placemark: YMapsPlacemark;
  templateLayoutFactory: { createClass: (template: string) => unknown };
  util: { bounds: { fromPoints: (points: [number, number][]) => [[number, number], [number, number]] } };
}

declare global {
  interface Window {
    ymaps?: YMapsNamespace;
    __hotelMapSelect?: (id: string) => void;
  }
}

interface HotelMapProps {
  activeId: MapPointId | null;
  onSelect: (id: MapPointId) => void;
}

export function HotelMap({ activeId, onSelect }: HotelMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
  const [scriptReady, setScriptReady] = useState(false);
  const mapRef = useRef<YMapsMap | null>(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    window.__hotelMapSelect = (id: string) => onSelectRef.current(id as MapPointId);
    return () => {
      delete window.__hotelMapSelect;
    };
  }, []);

  // Место выбрано снаружи (например, в редакционном блоке над картой) —
  // плавно переносим центр карты, без этого меняется только активная
  // карточка/маркер, а карта остаётся на месте.
  useEffect(() => {
    if (!activeId) return;
    const point = CITY_MAP_POINTS.find((p) => p.id === activeId);
    if (!point) return;
    mapRef.current?.setCenter([point.coords.lat, point.coords.lon], 16, { duration: 300 });
  }, [activeId]);

  useEffect(() => {
    if (!scriptReady) return;
    const ymaps = window.ymaps;
    const coords = hotel.coords;
    if (!ymaps || !coords) return;

    ymaps.ready(() => {
      if (mapRef.current) return; // защита от повторной инициализации (Fast Refresh)

      const map = new ymaps.Map(MAP_ELEMENT_ID, {
        center: [coords.lat, coords.lon],
        zoom: 14,
        controls: ["zoomControl"],
      });
      mapRef.current = map;

      map.geoObjects.add(
        new ymaps.Placemark([coords.lat, coords.lon], {}, {
          iconLayout: ymaps.templateLayoutFactory.createClass(HOTEL_PIN_HTML),
          iconShape: { type: "Circle", coordinates: [36, 36], radius: 36 },
          iconOffset: [-36, -36],
        }),
      );

      for (const point of CITY_MAP_POINTS) {
        const placemark = new ymaps.Placemark([point.coords.lat, point.coords.lon], {}, {
          iconLayout: ymaps.templateLayoutFactory.createClass(pointPinHtml(point)),
          iconShape: { type: "Circle", coordinates: [20, 20], radius: 20 },
          iconOffset: [-20, -20],
        });
        placemark.events.add("click", () => window.__hotelMapSelect?.(point.id));
        placemark.events.add("mouseenter", () => {
          document.querySelector(`[data-point-id="${point.id}"]`)?.classList.add("hm-pin--hover");
        });
        placemark.events.add("mouseleave", () => {
          document.querySelector(`[data-point-id="${point.id}"]`)?.classList.remove("hm-pin--hover");
        });
        map.geoObjects.add(placemark);
      }

      const points: [number, number][] = [
        [coords.lat, coords.lon],
        ...CITY_MAP_POINTS.map((p): [number, number] => [p.coords.lat, p.coords.lon]),
      ];
      map.setBounds(ymaps.util.bounds.fromPoints(points), {
        checkZoomRange: true,
        zoomMargin: 64,
      });
    });

    return () => {
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [scriptReady]);

  if (!apiKey) {
    // Явная ошибка конфигурации лучше, чем молчаливо нерабочая карта
    // (см. src/components/bnovo-booking-module.tsx — тот же приём).
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
        Не задана переменная окружения NEXT_PUBLIC_YANDEX_MAPS_API_KEY. Карта не
        может быть инициализирована — см. .env.example, ключ бесплатный,
        получить на developer.tech.yandex.ru.
      </div>
    );
  }

  if (!hotel.coords) return null;

  return (
    <div className="relative h-[420px] w-full border-t border-white/10 sm:h-[520px] lg:h-[680px]">
      <Script
        src={`https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <style>{`
          #${MAP_ELEMENT_ID} [class*="ground-pane"] {
            filter: saturate(0.55) brightness(1.04) contrast(0.95);
          }
          .hm-pin {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            background: ${NAVY};
            border: 3px solid ${GOLD};
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
            transition: transform 0.15s ease;
            cursor: pointer;
          }
          .hm-pin--hover,
          .hm-pin:focus-visible {
            transform: scale(1.1);
            outline: none;
          }
          .hm-pin--hotel {
            position: relative;
            border-width: 5px;
            box-shadow: 0 0 0 6px rgba(217, 164, 65, 0.18), 0 6px 20px rgba(0, 0, 0, 0.45);
            cursor: default;
          }
          .hm-hotel-caption {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            white-space: nowrap;
            line-height: 1.25;
            background: ${NAVY};
            border-radius: 8px;
            padding: 3px 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          }
          .hm-hotel-caption__name {
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.02em;
            color: #fff;
          }
          .hm-hotel-caption__addr {
            font-size: 10px;
            color: ${GOLD};
          }
        `}</style>
      <div id={MAP_ELEMENT_ID} className="h-full w-full" />
    </div>
  );
}
