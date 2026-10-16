"use client";

import { useState } from "react";
import { UFS } from "@/config/site";
import { corCandidato, fmtPct, titulo } from "@/lib/format";
import { useMapa } from "@/lib/hooks";
import type { MapaUF } from "@/lib/tse/types";

// Mapa em "ladrilhos": cada estado é um quadrado na posição aproximada do mapa real.
// Leve, legível no celular e todos os estados têm o mesmo tamanho (DF e SE não somem).
const GRADE: Record<string, [linha: number, coluna: number]> = {
  rr: [0, 2], ap: [0, 4],
  am: [1, 1], pa: [1, 3], ma: [1, 4], ce: [1, 5], rn: [1, 6],
  ac: [2, 0], ro: [2, 1], mt: [2, 2], to: [2, 3], pi: [2, 4], pe: [2, 5], pb: [2, 6],
  ms: [3, 2], go: [3, 3], df: [3, 4], ba: [3, 5], al: [3, 6],
  sp: [4, 3], mg: [4, 4], es: [4, 5], se: [4, 6],
  pr: [5, 3], rj: [5, 4],
  sc: [6, 3],
  rs: [7, 3],
  zz: [7, 0],
};

export function MapaBrasil() {
  const { data, isLoading } = useMapa();
  const [sel, setSel] = useState<MapaUF | null>(null);
  const [tabela, setTabela] = useState(false);

  const porUf = new Map(data?.ufs.map((u) => [u.uf, u]) ?? []);
  const candidatos = data?.ufs.find((u) => u.candidatos.length)?.candidatos ?? [];
  const legenda = [...candidatos].sort((a, b) => a.cor - b.cor);

  return (
    <section className="rounded-3xl bg-surface p-4 shadow-cartao sm:p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-xl font-black tracking-tight">Quem lidera em cada estado</h2>
          <p className="text-sm text-ink-2">Presidente · toque em um estado para ver os números</p>
        </div>
        <button
          onClick={() => setTabela((t) => !t)}
          className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-2 hover:bg-surface-2"
        >
          {tabela ? "Ver mapa" : "Ver tabela"}
        </button>
      </header>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-2">
        {legenda.map((c) => (
          <span key={c.sq} className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm" style={{ background: corCandidato(c.cor) }} />
            {titulo(c.nome)} à frente
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-vazio" /> Sem votos apurados
        </span>
      </div>

      {isLoading && !data ? (
        <div className="mt-4 aspect-[7/8] animate-pulse rounded-xl bg-surface-2 sm:aspect-[7/6]" />
      ) : tabela ? (
        <TabelaEstados ufs={data?.ufs ?? []} />
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_16rem]">
          <div
            className="mx-auto grid w-full max-w-md gap-1"
            style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gridTemplateRows: "repeat(8, auto)" }}
          >
            {Object.entries(GRADE).map(([uf, [l, c]]) => {
              const u = porUf.get(uf);
              const lider = u && u.pctSecoes > 0 ? u.candidatos[0] : null;
              const margem = u && u.candidatos.length > 1 ? u.candidatos[0].pct - u.candidatos[1].pct : 0;
              // Margem pequena = tom mais claro (disputa apertada); 20+ pontos = cor cheia.
              const forca = Math.round(45 + Math.min(margem, 20) * 2.75);
              return (
                <button
                  key={uf}
                  onClick={() => u && setSel(u)}
                  onMouseEnter={() => u && setSel(u)}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-md text-[10px] font-bold uppercase leading-none transition-transform hover:scale-105 focus-visible:outline-2 sm:text-xs ${sel?.uf === uf ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""}`}
                  style={{
                    gridRow: l + 1,
                    gridColumn: c + 1,
                    background: lider
                      ? `color-mix(in oklab, ${corCandidato(lider.cor)} ${forca}%, var(--surface))`
                      : "var(--vazio)",
                    color: lider && forca >= 70 ? "#fff" : "var(--text)",
                  }}
                  aria-label={`${UFS[uf]}: ${lider ? `${titulo(lider.nome)} lidera com ${fmtPct(lider.pct)}` : "sem votos apurados"}`}
                >
                  {uf === "zz" ? "EXT" : uf}
                  {u && u.pctSecoes > 0 && (
                    <span className="num mt-0.5 hidden text-[9px] font-medium opacity-90 sm:block">
                      {Math.round(u.pctSecoes)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <DetalheUF u={sel} />
        </div>
      )}
      <p className="mt-3 text-xs text-muted">
        Cor mais forte = vantagem maior. O número pequeno indica o % de urnas apuradas no estado.
      </p>
    </section>
  );
}

function DetalheUF({ u }: { u: MapaUF | null }) {
  if (!u) {
    return (
      <div className="flex items-center justify-center rounded-xl bg-surface-2 p-4 text-center text-sm text-ink-2">
        Passe o mouse ou toque em um estado
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-surface-2 p-4">
      <p className="text-xs uppercase tracking-wide text-ink-2">{UFS[u.uf]}</p>
      <p className="num text-sm text-muted">{fmtPct(u.pctSecoes)} das urnas apuradas</p>
      <ul className="mt-3 space-y-3">
        {u.candidatos.map((c) => (
          <li key={c.sq}>
            <div className="flex justify-between text-sm">
              <span className="font-medium">{titulo(c.nome)}</span>
              <span className="num font-bold">{fmtPct(c.pct)}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-vazio">
              <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: corCandidato(c.cor) }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TabelaEstados({ ufs }: { ufs: MapaUF[] }) {
  const ord = [...ufs].sort((a, b) => UFS[a.uf].localeCompare(UFS[b.uf]));
  const cands = ufs.find((u) => u.candidatos.length)?.candidatos.slice().sort((a, b) => a.cor - b.cor) ?? [];
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs text-ink-2">
            <th className="py-2 pr-2 font-medium">Estado</th>
            <th className="py-2 pr-2 text-right font-medium">Apuradas</th>
            {cands.map((c) => (
              <th key={c.sq} className="py-2 pr-2 text-right font-medium">{titulo(c.nome)}</th>
            ))}
          </tr>
        </thead>
        <tbody className="num">
          {ord.map((u) => (
            <tr key={u.uf} className="border-b border-line/60">
              <td className="py-1.5 pr-2">{UFS[u.uf]}</td>
              <td className="py-1.5 pr-2 text-right text-ink-2">{fmtPct(u.pctSecoes)}</td>
              {cands.map((c) => {
                const v = u.candidatos.find((x) => x.sq === c.sq);
                const lider = u.pctSecoes > 0 && u.candidatos[0]?.sq === c.sq;
                return (
                  <td key={c.sq} className={`py-1.5 pr-2 text-right ${lider ? "font-bold" : ""}`}>
                    {v ? fmtPct(v.pct) : "–"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
