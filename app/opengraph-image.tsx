import { ImageResponse } from "next/og";

export const alt = "Beldar Build HQ — technical drawing of a cone headpiece";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const ink = "#1d1c1a";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4efe3", padding: 64, fontFamily: "sans-serif", color: ink, backgroundImage: "linear-gradient(rgba(44,74,110,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(44,74,110,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>
            <span style={{ background: ink, color: "#f4efe3", padding: "4px 10px" }}>Form RFB-1993</span>
            <span style={{ marginLeft: 16, color: "#6b665c" }}>Remulak Fabrication Bureau</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 0.9, letterSpacing: 2, textTransform: "uppercase" }}>Beldar</div>
            <div style={{ fontSize: 132, fontWeight: 800, lineHeight: 0.9, letterSpacing: 2, textTransform: "uppercase" }}>Build HQ</div>
            <div style={{ marginTop: 24, fontSize: 30, color: "#4a463f" }}>Halloween 2026 · fabrication guide & project tracker</div>
          </div>
        </div>
        <svg width="420" height="500" viewBox="0 0 300 380">
          <path d="M70 250 C 76 190 92 110 128 56 C 140 38 160 38 172 56 C 208 110 224 190 230 250 Z" fill="#e8d3a2" stroke={ink} strokeWidth="3" />
          <path d="M60 250 H 240" stroke={ink} strokeWidth="2" strokeDasharray="4 5" />
          <path d="M150 20 V 300" stroke="#2c4a6e" strokeWidth="2" strokeDasharray="12 6 3 6" />
          <path d="M74 222 Q 150 234 226 222" stroke={ink} strokeWidth="2.5" fill="none" />
          <path d="M66 262 Q 150 276 234 262" stroke="#a3342a" strokeWidth="3" strokeDasharray="8 5" fill="none" />
          <path d="M30 248 V 44" stroke={ink} strokeWidth="2.5" />
          <path d="M22 56 L30 40 L38 56 Z M22 236 L30 252 L38 236 Z" fill={ink} />
          <path d="M80 250 C 80 300 104 340 150 350 C 196 340 220 300 220 250" fill="#e8d3a2" stroke={ink} strokeWidth="2.5" />
        </svg>
      </div>
    ),
    size,
  );
}
