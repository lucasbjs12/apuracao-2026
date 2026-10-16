import { ImageResponse } from "next/og";
import { carregarResultado } from "@/lib/tse/carregar";
import { titulo } from "@/lib/format";
import { SITE } from "@/config/site";

// Imagem de prévia do link no WhatsApp/redes. O site é estático, então ela é gerada no build:
// por isso mostra só o convite, sem números (nunca exibe placar desatualizado).
export const dynamic = "force-static";
export const alt = "Apuração do 2º turno ao vivo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CORES = ["#00a99d", "#8b45f5"];

export default async function Image() {
  const r = await carregarResultado("presidente", "br").catch(() => null);
  const cands = r ? [...r.candidatos].sort((a, b) => a.cor - b.cor) : [];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "linear-gradient(135deg, #0b0f2e, #241062)", color: "#fff", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", background: "#ffc21a", color: "#000", fontSize: 28, padding: "8px 20px", borderRadius: 999 }}>
            ELEIÇÕES 2026 · 2º TURNO
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 84, marginTop: 28, lineHeight: 1 }}>Apuração ao vivo</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 16, color: "#c9cbe6" }}>
          Presidente e Governadores · domingo, 25/10, a partir das 17h
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: "auto" }}>
          {cands.map((c) => (
            <div key={c.sq} style={{ flex: 1, display: "flex", flexDirection: "column", borderRadius: 24, background: "rgba(255,255,255,0.08)", padding: "24px 32px", borderTop: `10px solid ${CORES[c.cor % 2]}` }}>
              <div style={{ display: "flex", fontSize: 44 }}>{titulo(c.nome)}</div>
              <div style={{ display: "flex", fontSize: 26, color: "#c9cbe6", marginTop: 8 }}>{`${c.partido} · ${c.numero}`}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#c9cbe6", marginTop: 24 }}>{`${SITE.nome} · dados oficiais do TSE`}</div>
      </div>
    ),
    size,
  );
}
