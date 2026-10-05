/** Shared JSX for generated PNG icons (ImageResponse / Satori). */
export function IconArt({ size, maskable = false }: { size: number; maskable?: boolean }) {
  const pad = maskable ? size * 0.18 : size * 0.1;
  const s = size - pad * 2;
  return (
    <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "#1d1c1a", borderRadius: maskable ? 0 : size * 0.18 }}>
      <svg width={s} height={s} viewBox="0 0 32 32">
        <path d="M7 27 C 8.5 17, 11.5 5, 16 3 C 20.5 5, 23.5 17, 25 27 Z" fill="#e8d3a2" stroke="#f4efe3" strokeWidth="1" strokeLinejoin="round" />
        <path d="M4.5 27 H 27.5" stroke="#f4efe3" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 4 V 27" stroke="#2c4a6e" strokeWidth="0.8" strokeDasharray="1.4 1.4" />
        <path d="M10 21 Q 16 19 22 21" stroke="#1d1c1a" strokeWidth="0.6" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
}
