import { hotel } from "@/content/site";

/**
 * Точки для интерактивной карты «Смарт румс рядом» (см.
 * src/components/brand/hotel-map.tsx).
 *
 * Время в пути — не с референс-картинки (там уже были расхождения с
 * реальностью, см. историю чата), а проверено живыми маршрутами на
 * yandex.ru/maps (пешком, от Марата, 30).
 */

export type MapPointId =
  | "mayakovskaya"
  | "vladimirskaya"
  | "vokzal"
  | "nevsky"
  | "dumskaya"
  | "rubinshteyna"
  | "anichkov"
  | "gallery"
  | "theater";

// Ключ иконки Lucide (см. ICON_COMPONENTS/ICON_PATHS в hotel-map.tsx) —
// "metro" не иконка Lucide, а собственный значок «М» в кружке.
export type MapPointIcon = "metro" | "vokzal" | "nevsky" | "bar" | "bridge" | "theater" | "gallery";

/** Что это за место — подпись категории рядом с названием (карта, блок «Петербург»). */
export const CATEGORY_LABEL: Record<MapPointIcon, string> = {
  metro: "Метро",
  vokzal: "Вокзал",
  nevsky: "Проспект",
  bar: "Улица",
  bridge: "Мост",
  theater: "Театр",
  gallery: "Торговый центр",
};

export interface MapPoint {
  id: MapPointId;
  name: string;
  icon: MapPointIcon;
  minutes: number;
  coords: { lat: number; lon: number };
}

export const CITY_MAP_POINTS: MapPoint[] = [
  {
    id: "mayakovskaya",
    name: "Маяковская",
    icon: "metro",
    minutes: 8,
    coords: { lat: 59.931386, lon: 30.355314 },
  },
  {
    id: "vladimirskaya",
    name: "Владимирская",
    icon: "metro",
    minutes: 7,
    coords: { lat: 59.927432, lon: 30.348207 },
  },
  {
    id: "vokzal",
    name: "Московский вокзал",
    icon: "vokzal",
    minutes: 12,
    coords: { lat: 59.929984, lon: 30.362158 },
  },
  {
    id: "nevsky",
    name: "Невский проспект",
    icon: "nevsky",
    minutes: 12,
    coords: { lat: 59.932464, lon: 30.349258 },
  },
  {
    id: "dumskaya",
    name: "Думская улица",
    icon: "bar",
    minutes: 26,
    coords: { lat: 59.933505, lon: 30.328543 },
  },
  {
    id: "rubinshteyna",
    name: "Улица Рубинштейна",
    icon: "bar",
    minutes: 10,
    coords: { lat: 59.929542, lon: 30.344268 },
  },
  {
    id: "anichkov",
    name: "Аничков мост",
    icon: "bridge",
    minutes: 15,
    coords: { lat: 59.933249, lon: 30.343379 },
  },
  {
    id: "gallery",
    name: "Галерея",
    icon: "gallery",
    minutes: 9,
    coords: { lat: 59.927819, lon: 30.360482 },
  },
  {
    id: "theater",
    name: "Александринский театр",
    icon: "theater",
    minutes: 20,
    coords: { lat: 59.931793, lon: 30.3363 },
  },
];

export function routeHref(point: MapPoint): string {
  const from = hotel.coords ? `${hotel.coords.lat},${hotel.coords.lon}` : "";
  const to = `${point.coords.lat},${point.coords.lon}`;
  return `https://yandex.ru/maps/?mode=routes&rtext=${from}~${to}&rtt=pd`;
}
