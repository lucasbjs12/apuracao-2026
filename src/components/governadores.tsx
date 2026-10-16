"use client";

import Image from "next/image";
import Link from "next/link";
import { UFS, UFS_GOVERNADOR_2T } from "@/config/site";
import { corCandidato, fmtPct, titulo } from "@/lib/format";
import { useDemo, useResultado } from "@/lib/hooks";

export function Governadores() {
  return (
    <section>
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-black tracking-tight">Governadores no 2º turno</h2>
          <p className="text-sm text-ink-2">Seis estados escolhem o governador neste domingo.</p>
        </div>
        <span className="shrink-0 text-xs font-medium text-muted sm:hidden">Deslize →</span>
      </div>
      {/* Celular: carrossel com "snap". Telas maiores: grade. */}
      <div className="sem-barra -mx-3 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {UFS_GOVERNADOR_2T.map((uf) => (
          <CartaoGovernador key={uf} uf={uf} />
        ))}
      </div>
    </section>
  );
}

function CartaoGovernador({ uf }: { uf: string }) {
  const { data } = useResultado("governador", uf);
  const demo = useDemo();
  const ord = data ? [...data.candidatos].sort((a, b) => a.cor - b.cor) : [];
  const total = ord.reduce((s, c) => s + c.votos, 0);
  const lider = data && data.pctSecoes > 0 ? data.candidatos[0] : null;

  return (
    <Link
      href={`/governador/${uf}${demo ? "?demo=1" : ""}`}
      className="group block w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl bg-surface shadow-cartao transition-transform active:scale-[0.98] sm:w-auto sm:hover:-translate-y-0.5"
    >
      <div className="fundo-noite flex items-center justify-between px-4 py-3">
        <h3 className="font-extrabold">{UFS[uf]}</h3>
        <span className="num rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold text-ouro">
          {data ? `${fmtPct(data.pctSecoes)} apuradas` : "…"}
        </span>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {ord.map((c) => (
            <li key={c.sq} className="flex items-center gap-3">
              <div
                className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface-2"
                style={{ boxShadow: `0 0 0 2px var(--surface), 0 0 0 4px ${corCandidato(c.cor)}` }}
              >
                {c.foto ? (
                  <Image src={c.foto} alt="" fill sizes="44px" className="object-cover" />
                ) : (
                  <span className="grid size-full place-items-center text-sm font-black text-ink-2">
                    {c.nome.split(" ").at(-1)?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-bold">
                  {titulo(c.nome)}
                  {c.eleito && (
                    <span className="rounded-full px-1.5 text-[10px] font-black text-white uppercase" style={{ background: corCandidato(c.cor) }}>
                      Eleito
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted">{c.partido}</p>
              </div>
              <span className={`num text-xl font-black ${c === lider ? "" : "text-ink-2"}`}>{fmtPct(c.pct)}</span>
            </li>
          ))}
          {!data && <li className="h-24 animate-pulse rounded-xl bg-surface-2" />}
        </ul>
        <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-vazio">
          {total > 0 &&
            ord.map((c) => (
              <div key={c.sq} className="h-full" style={{ width: `${(c.votos / total) * 100}%`, background: corCandidato(c.cor) }} />
            ))}
        </div>
        <p className="mt-3 text-xs font-semibold text-ink-2 group-hover:underline">Ver detalhes →</p>
      </div>
    </Link>
  );
}
