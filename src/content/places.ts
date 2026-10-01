import { CITY_MAP_POINTS, type MapPoint, type MapPointId } from "@/content/city-map";

/**
 * Контент для редакционного блока «Петербург вокруг вас» (одно место за
 * раз, см. src/components/brand/petersburg-explorer.tsx). Координаты,
 * время в пути и иконка — общие с картой (не дублируем, см.
 * src/content/city-map.ts), здесь только то, что специфично для истории:
 * фото, текст, факт, источник.
 *
 * Фото — реальные, с Wikimedia Commons, лицензии проверены и указаны
 * (source/sourceUrl/license/author). Не AI-генерация.
 */

export type PlaceId = Exclude<MapPointId, "rubinshteyna">;

interface PlaceContent {
  description: string;
  shortFact?: string;
  image: string;
  imageAlt: string;
  author: string;
  license: string;
  sourceUrl: string;
}

const PLACE_CONTENT: Record<PlaceId, PlaceContent> = {
  nevsky: {
    description:
      "Главная улица Петербурга — прямая линия фасадов от Адмиралтейства до Александро-Невской лавры. Магазины, кафе и вечная городская суета начинаются уже через несколько минут от отеля.",
    shortFact:
      "Проспект тянется на 4,5 км. Нечётную сторону петербуржцы по старой привычке зовут «теневой», чётную — «солнечной».",
    image: "/images/places/nevsky.jpg",
    imageAlt: "Невский проспект в Санкт-Петербурге",
    author: "Vasilii Martynov",
    license: "CC0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Nevsky_Prospekt_20240912_114912_MP.jpg",
  },
  anichkov: {
    description:
      "Один из старейших мостов через Фонтанку — знаменит на весь мир четырьмя скульптурными группами Петра Клодта «Укрощение коня». Мост лежит прямо на Невском проспекте.",
    shortFact:
      "Осенью 1941 года скульптуры сняли с постаментов и закопали в саду Аничкова дворца, чтобы уберечь от обстрелов — вернули на место только после снятия блокады.",
    image: "/images/places/anichkov.jpg",
    imageAlt: "Аничков мост со скульптурами Петра Клодта",
    author: "Alex 'Florstein' Fedorov",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Anichkov_Bridge_SPB.jpg",
  },
  theater: {
    description:
      "Александринский театр — старейший национальный театр России, основанный в 1756 году. Нынешнее здание в стиле ампир на площади Островского построил архитектор Карло Росси в 1832 году.",
    shortFact: "Один из первых государственных публичных театров Европы — труппа выступает уже почти 270 лет.",
    image: "/images/places/theater.jpg",
    imageAlt: "Александринский театр в Санкт-Петербурге",
    author: "Alex 'Florstein' Fedorov",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Alexandrinsky_Theatre.jpg",
  },
  gallery: {
    description:
      "Один из крупнейших торговых центров в центре города — сотни магазинов, кафе и кинотеатр под одной крышей, в паре минут от Московского вокзала.",
    image: "/images/places/gallery.jpg",
    imageAlt: "Торгово-развлекательный центр «Галерея» на Лиговском проспекте",
    author: "Olga Zhiganova",
    license: "CC BY-SA 3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%A2%D0%A0%D0%A6_%D0%93%D0%B0%D0%BB%D0%B5%D1%80%D0%B5%D1%8F_(Galeria),_%D0%9B%D0%B8%D0%B3%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9_%D0%BF%D1%80.,_%D0%B4.30%D0%B0.jpg",
  },
  dumskaya: {
    description:
      "Думская улица — короткая улица в двух шагах от Невского, где сосредоточены десятки баров и рюмочных. Название — от здания Городской думы с узнаваемой часовой башней на углу.",
    shortFact:
      "В 1839 году думская башня стала одним из звеньев самой длинной в мире (1200 км) линии оптического телеграфа Петербург — Варшава.",
    image: "/images/places/dumskaya.jpg",
    imageAlt: "Думская улица и башня Городской думы в Санкт-Петербурге",
    author: "SmallSonMarex",
    license: "CC0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%A3%D0%BB%D0%B8%D1%86%D0%B0_%D0%94%D1%83%D0%BC%D1%81%D0%BA%D0%B0%D1%8F._%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3_17.08.2025.jpg",
  },
  vokzal: {
    description:
      "Московский (бывший Николаевский) вокзал открыт в 1851 году как конечная станция первой в России магистральной железной дороги — между Петербургом и Москвой.",
    shortFact:
      "Здание — почти точная копия Ленинградского вокзала в Москве: оба построены по одному проекту архитектора Константина Тона для двух концов одной дороги.",
    image: "/images/places/vokzal.jpg",
    imageAlt: "Московский вокзал в Санкт-Петербурге",
    author: "A.Savin",
    license: "Free Art License",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Spb_06-2017_img19_Moskovsky_railway_station.jpg",
  },
  mayakovskaya: {
    description:
      "Станция открыта в 1967 году на Невско-Василеостровской линии, у самого начала Невского проспекта — рядом с площадью Восстания и Московским вокзалом.",
    shortFact: "Один из выходов станции ведёт прямо на улицу Марата — туда же, где стоит отель.",
    image: "/images/places/mayakovskaya.jpg",
    imageAlt: "Наземный вестибюль станции метро «Маяковская»",
    author: "Андрей! (AndreyA)",
    license: "Public Domain",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mayakovskaya_metrostation_Hall.jpg",
  },
  vladimirskaya: {
    description:
      "Станция первой линии Петербургского метро, открыта в 1955 году. Названа по стоящей рядом Владимирской церкви XVIII века.",
    shortFact:
      "Подземный переход соединяет станцию с «Достоевской» — писатель провёл последние годы жизни в доме в двух шагах отсюда, на Кузнечном переулке.",
    image: "/images/places/vladimirskaya.jpg",
    imageAlt: "Станция метро «Владимирская» в Санкт-Петербурге",
    author: "A.Savin",
    license: "Free Art License",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Metro_SPB_Line1_Vladimirskaya.jpg",
  },
};

export const PLACE_ORDER: PlaceId[] = [
  "nevsky",
  "anichkov",
  "theater",
  "gallery",
  "dumskaya",
  "vokzal",
  "mayakovskaya",
  "vladimirskaya",
];

export interface Place extends MapPoint, PlaceContent {
  id: PlaceId;
}

export const PLACES: Place[] = PLACE_ORDER.map((id) => {
  const point = CITY_MAP_POINTS.find((p) => p.id === id);
  if (!point) throw new Error(`city-map.ts: нет точки для места "${id}"`);
  return { ...point, ...PLACE_CONTENT[id], id };
});

export const DEFAULT_PLACE_ID: PlaceId = "nevsky";
