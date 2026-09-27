/**
 * Векторная иллюстрация «синего часа» на улице Марата — временная замена
 * фотографии (раздел 3 спецификации, CLAUDE.md раздел 7): холодное небо и
 * фасады, тёплый акцент только в окнах и фонаре. Когда появится реальная
 * съёмка района, компонент заменяется на next/image.
 */
export function HeroArt() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="street-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e1620" />
          <stop offset="0.55" stopColor="#25333f" />
          <stop offset="1" stopColor="#3c4d5a" />
        </linearGradient>
        <linearGradient id="street-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#232f38" />
          <stop offset="1" stopColor="#0f161c" />
        </linearGradient>
        <radialGradient id="street-glow" cx="0.7" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e9a55b" stopOpacity="0.5" />
          <stop offset="1" stopColor="#e9a55b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lamp-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f3c088" stopOpacity="0.95" />
          <stop offset="1" stopColor="#f3c088" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9b6c1" stopOpacity="0" />
          <stop offset="1" stopColor="#a9b6c1" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#street-sky)" />
      <rect width="1440" height="900" fill="url(#street-glow)" />

      {/* туман над крышами */}
      <g fill="#c7d2da" opacity="0.1">
        <ellipse cx="300" cy="260" rx="320" ry="30" />
        <ellipse cx="900" cy="200" rx="260" ry="24" />
      </g>

      {/* доходные дома — фасады вдоль улицы */}
      <g fill="#1a232b">
        <rect x="-20" y="300" width="420" height="380" />
        <rect x="380" y="240" width="360" height="440" />
        <rect x="720" y="280" width="330" height="400" />
        <rect x="1030" y="230" width="430" height="450" />
      </g>
      {/* карнизы */}
      <g fill="#141c23">
        <rect x="-20" y="290" width="420" height="14" />
        <rect x="380" y="230" width="360" height="14" />
        <rect x="720" y="270" width="330" height="14" />
        <rect x="1030" y="220" width="430" height="14" />
      </g>

      {/* окна — тёмные, редкие тёплые (не больше 2–3 акцентов) */}
      <g>
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => {
            const x = 20 + col * 62;
            const y = 340 + row * 42;
            return <rect key={`a-${row}-${col}`} x={x} y={y} width="26" height="30" fill="#0c1216" />;
          }),
        )}
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => {
            const x = 410 + col * 62;
            const y = 280 + row * 42;
            return <rect key={`b-${row}-${col}`} x={x} y={y} width="26" height="30" fill="#0c1216" />;
          }),
        )}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => {
            const x = 750 + col * 60;
            const y = 320 + row * 42;
            return <rect key={`c-${row}-${col}`} x={x} y={y} width="26" height="30" fill="#0c1216" />;
          }),
        )}
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => {
            const x = 1060 + col * 62;
            const y = 270 + row * 42;
            return <rect key={`d-${row}-${col}`} x={x} y={y} width="26" height="30" fill="#0c1216" />;
          }),
        )}

        {/* тёплые окна — единственный акцент помимо фонаря */}
        <rect x="1184" y="396" width="26" height="30" fill="#f3c088" opacity="0.9" />
        <rect x="1246" y="438" width="26" height="30" fill="#f3c088" opacity="0.75" />
      </g>

      {/* улица */}
      <rect x="0" y="680" width="1440" height="220" fill="url(#street-road)" />
      <g fill="#141c23" opacity="0.6">
        {Array.from({ length: 46 }).map((_, i) => (
          <rect key={i} x={i * 32} y="686" width="3" height="200" transform={`skewX(-6)`} />
        ))}
      </g>
      {/* мокрые блики */}
      <g stroke="#f3c088" strokeWidth="3" opacity="0.3" strokeLinecap="round">
        <line x1="1120" y1="760" x2="1120" y2="860" />
        <line x1="1160" y1="770" x2="1160" y2="850" />
        <line x1="1080" y1="775" x2="1080" y2="845" />
      </g>

      {/* фонарь — главный тёплый объект, справа над карточкой бронирования */}
      <circle cx="1150" cy="430" r="180" fill="url(#lamp-glow)" />
      <g fill="#0c1216">
        <rect x="1144" y="470" width="10" height="420" />
        <rect x="1128" y="456" width="42" height="16" rx="3" />
        <path d="M1120 456 L1149 398 L1178 456 Z" />
      </g>
      <rect x="1136" y="406" width="26" height="42" fill="#f3c088" />
      <circle cx="1149" cy="427" r="38" fill="url(#lamp-glow)" opacity="0.85" />

      <rect width="1440" height="900" fill="url(#mist)" />
    </svg>
  );
}

/** Градиентная «открытка» вместо фото — временная замена (см. HeroArt). */
export function PhotoPlaceholder({
  variant,
  className,
}: {
  variant: "metro" | "embankment";
  className?: string;
}) {
  const stops =
    variant === "metro"
      ? ["#1d2a35", "#3c4d5a", "#e9a55b"]
      : ["#1a232b", "#25333f", "#a9b6c1"];
  const id = `ph-${variant}`;
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" aria-hidden className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stops[0]} />
          <stop offset="0.6" stopColor={stops[1]} />
          <stop offset="1" stopColor={stops[2]} />
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill={`url(#${id})`} />
      {variant === "metro" ? (
        <g fill="#0c1216">
          <rect x="20" y="70" width="70" height="130" />
          <rect x="95" y="50" width="60" height="150" />
          <rect x="160" y="80" width="50" height="120" />
          <rect x="215" y="60" width="70" height="140" />
          <rect x="225" y="90" width="18" height="22" fill="#e9a55b" opacity="0.85" />
        </g>
      ) : (
        <g fill="#0c1216">
          <rect x="0" y="120" width="300" height="80" fill="#1d2a35" />
          <rect x="30" y="70" width="240" height="50" />
          <rect x="60" y="90" width="16" height="20" fill="#e9a55b" opacity="0.85" />
          <rect x="0" y="118" width="300" height="6" />
        </g>
      )}
    </svg>
  );
}
