/**
 * Градиентная «открытка» вместо фото — временная замена (CLAUDE.md раздел 7).
 * Заменить на next/image, когда для этих двух блоков появятся реальные
 * фото (у метро «Владимирская» и набережная/двор-колодец).
 */
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
