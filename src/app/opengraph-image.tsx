import { ImageResponse } from "next/og";
import { connection } from "next/server";
import { getResultado } from "@/lib/tse/fetch";
import { fmtPct, titulo } from "@/lib/format";
import { SITE } from "@/config/site";

// Imagem que aparece quando o link é colado no WhatsApp/redes, com o placar do momento.
export const alt = "Apuração do 2º turno ao vivo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CORES = ["#1baf7a", "#6250d6"];

export default async function Image() {
  await connection(); // gera na hora, com dados atuais
  const r = await getResultado("presidente", "br").catch(() => null);
  const cands = r ? [...r.candidatos].sort((a, b) => a.cor - b.cor) : [];
  const comecou = !!r && r.pctSecoes > 0;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0f0f0e", color: "#f0efec", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#c3c2b7" }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: comecou ? "#ef5a54" : "#8f8e86" }} />
          <div style={{ display: "flex" }}>
            {comecou ? `AO VIVO · ${fmtPct(r!.pctSecoes)} das urnas apuradas` : "2º turno · 25 de outubro · a partir das 17h"}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, marginTop: 16 }}>Apuração para Presidente</div>
        <div style={{ display: "flex", gap: 32, marginTop: 48, flex: 1 }}>
          {cands.map((c) => (
            <div key={c.sq} style={{ flex: 1, display: "flex", flexDirection: "column", borderRadius: 24, background: "#1a1a19", padding: 36, borderTop: `10px solid ${CORES[c.cor % 2]}` }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>{titulo(c.nome)}</div>
              <div style={{ display: "flex", fontSize: 26, color: "#8f8e86", marginTop: 12 }}>{`${c.partido} · ${c.numero}`}</div>
              <div style={{ display: "flex", fontSize: 110, fontWeight: 800, marginTop: "auto" }}>{comecou ? fmtPct(c.pct) : "—"}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#8f8e86", marginTop: 28 }}>{`${SITE.nome} · dados oficiais do TSE`}</div>
      </div>
    ),
    { ...size, headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
