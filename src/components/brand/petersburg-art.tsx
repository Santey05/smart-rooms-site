/**
 * Векторные иллюстрации в стиле референса: вечерний Петербург.
 * Это временная замена фотографиям (см. CLAUDE.md, раздел 7): когда появятся
 * реальные фото с проверенными правами, компоненты заменяются на next/image.
 */

/** Закатное небо + силуэт Исаакиевского собора, набережная и вода. */
export function HeroArt() {
  return (
    <svg
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141a3a" />
          <stop offset="0.45" stopColor="#4a3f78" />
          <stop offset="0.72" stopColor="#c8637a" />
          <stop offset="0.9" stopColor="#f0a566" />
          <stop offset="1" stopColor="#f6c27a" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="0.62" cy="0.7" r="0.5">
          <stop offset="0" stopColor="#ffd28a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffd28a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-dome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#c48a2c" />
        </linearGradient>
        <linearGradient id="hero-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a5f8a" />
          <stop offset="1" stopColor="#1a1f3d" />
        </linearGradient>
        <radialGradient id="hero-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe6a0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffe6a0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="760" fill="url(#hero-sky)" />
      <rect width="1440" height="760" fill="url(#hero-glow)" />

      {/* облака */}
      <g fill="#ffffff" opacity="0.12">
        <ellipse cx="250" cy="200" rx="260" ry="26" />
        <ellipse cx="620" cy="140" rx="200" ry="20" />
        <ellipse cx="1120" cy="230" rx="280" ry="24" />
      </g>

      {/* дальний ряд зданий */}
      <path
        d="M0 560 V520 H60 V500 H130 V530 H210 V505 H300 V540 H380 V515 H460 V545 H560 V520 H660 V560 Z M900 560 V525 H980 V500 H1060 V535 H1150 V510 H1240 V540 H1330 V515 H1440 V560 Z"
        fill="#3a3560"
        opacity="0.85"
      />

      {/* Исаакиевский собор */}
      <g fill="#2a2748">
        {/* колоннада и основание */}
        <rect x="770" y="470" width="330" height="90" />
        <path d="M770 470 L935 430 L1100 470 Z" />
        {/* барабан */}
        <rect x="880" y="360" width="110" height="80" />
        {/* колонны барабана */}
        <g fill="#3a3560">
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={888 + i * 13} y="366" width="6" height="70" />
          ))}
        </g>
        {/* угловые купола */}
        <rect x="790" y="420" width="46" height="50" />
        <rect x="1034" y="420" width="46" height="50" />
      </g>
      <path d="M880 360 Q935 250 990 360 Z" fill="url(#hero-dome)" />
      <rect x="931" y="262" width="8" height="26" fill="#c48a2c" />
      <path d="M921 262 h28 l-14 -22 z" fill="#ffe08a" />
      <path d="M790 420 Q813 385 836 420 Z" fill="url(#hero-dome)" />
      <path d="M1034 420 Q1057 385 1080 420 Z" fill="url(#hero-dome)" />

      {/* набережная */}
      <rect x="0" y="560" width="1440" height="22" fill="#221f3d" />
      <g fill="#221f3d">
        {Array.from({ length: 48 }).map((_, i) => (
          <rect key={i} x={i * 30 + 6} y="540" width="4" height="22" />
        ))}
        <rect x="0" y="538" width="1440" height="4" />
      </g>

      {/* вода с бликами */}
      <rect x="0" y="582" width="1440" height="178" fill="url(#hero-water)" />
      <g stroke="#ffd28a" strokeWidth="2" opacity="0.35" strokeLinecap="round">
        <line x1="880" y1="605" x2="990" y2="605" />
        <line x1="900" y1="625" x2="980" y2="625" />
        <line x1="915" y1="646" x2="965" y2="646" />
        <line x1="600" y1="612" x2="700" y2="612" />
        <line x1="1180" y1="618" x2="1290" y2="618" />
      </g>

      {/* фонарь справа */}
      <circle cx="1360" cy="150" r="120" fill="url(#hero-lamp)" />
      <g fill="#14172e">
        <rect x="1354" y="180" width="12" height="380" />
        <rect x="1342" y="170" width="36" height="14" rx="3" />
        <path d="M1336 170 L1360 130 L1384 170 Z" />
        <rect x="1346" y="140" width="28" height="30" fill="#ffe6a0" />
      </g>
    </svg>
  );
}

/** Градиентная «открытка» вместо фото для полароидов. */
export function PhotoPlaceholder({
  variant,
  className,
}: {
  variant: "metro" | "embankment";
  className?: string;
}) {
  const stops =
    variant === "metro"
      ? ["#2a2f5c", "#8a5a86", "#f0a566"]
      : ["#3b4f8a", "#b4688a", "#f6c27a"];
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
        <g fill="#1a1d3a">
          <rect x="20" y="70" width="70" height="130" />
          <rect x="95" y="50" width="60" height="150" />
          <rect x="160" y="80" width="50" height="120" />
          <rect x="215" y="60" width="70" height="140" />
          <circle cx="235" cy="40" r="16" fill="#e5433a" />
          <text x="235" y="46" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff">
            M
          </text>
        </g>
      ) : (
        <g fill="#1a1d3a">
          <rect x="0" y="120" width="300" height="80" fill="#3a3a68" />
          <rect x="30" y="70" width="240" height="50" />
          <path d="M120 70 Q150 20 180 70 Z" fill="#e8b85a" />
          <rect x="0" y="118" width="300" height="6" />
        </g>
      )}
    </svg>
  );
}
