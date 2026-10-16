"use client";

import Image from "next/image";
import { corCandidato, fmtNum, fmtPct, titulo } from "@/lib/format";
import { useResultado } from "@/lib/hooks";
import type { Candidato, Resultado } from "@/lib/tse/types";
import { Contagem } from "./contagem";
import { AoVivo } from "./ao-vivo";

type Props = { cargo: "presidente" | "governador"; uf: string; rotulo: string; id?: string };

export function Placar({ cargo, uf, rotulo, id }: Props) {
  const { data, error, isLoading } = useResultado(cargo, uf);

  if (isLoading && !data) return <PlacarEsqueleto />;
  if (error && !data) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-6 text-ink-2 shadow-cartao">
        Não conseguimos falar com o TSE agora. Tentaremos de novo automaticamente.
      </div>
    );
  }
  if (!data) return null;

  const naoComecou = data.pctSecoes === 0 && !data.simulacao;
  const exibidos = ordenarParaExibir(data.candidatos);
  const lider = data.pctSecoes > 0 ? data.candidatos[0] : null;

  return (
    <section id={id} className="overflow-hidden rounded-3xl bg-surface shadow-cartao" aria-live="polite">
      <div className="fundo-noite px-4 pt-4 pb-5 sm:px-6 sm:pt-5">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/85 sm:text-sm">{rotulo}</h2>
          <AoVivo r={data} claro />
        </header>
        {naoComecou && <Contagem />}
        <ProgressoUrnas r={data} />
      </div>

      <div className="p-3 sm:p-6">
        <div className="relative grid grid-cols-2 gap-2.5 sm:gap-5">
          {exibidos.map((c) => (
            <CartaoCandidato key={c.sq} c={c} lider={c === lider} />
          ))}
          <span className="absolute top-1/2 left-1/2 z-10 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ouro text-xs font-black text-black shadow-lg ring-4 ring-surface sm:size-11 sm:text-sm">
            VS
          </span>
        </div>

        <BarraDisputa candidatos={exibidos} />

        <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Estat rotulo="Comparecimento" valor={fmtPct(data.pctComparecimento)} sub={fmtNum(data.comparecimento)} />
          <Estat rotulo="Abstenção" valor={fmtPct(data.pctAbstencao)} sub={fmtNum(data.abstencao)} />
          <Estat rotulo="Brancos" valor={fmtPct(data.pctBrancos)} sub={fmtNum(data.brancos)} />
          <Estat rotulo="Nulos" valor={fmtPct(data.pctNulos)} sub={fmtNum(data.nulos)} />
        </dl>
        <p className="mt-3 text-xs text-muted">
          Percentuais dos candidatos calculados sobre os votos válidos. Brancos e nulos sobre o total de votos.
        </p>
      </div>
    </section>
  );
}

// Na tela, mantém sempre a mesma ordem (pelo número), para os cartões não trocarem de lugar.
export function ordenarParaExibir(c: Candidato[]) {
  return [...c].sort((a, b) => a.cor - b.cor);
}

function ProgressoUrnas({ r }: { r: Resultado }) {
  return (
    <div className="mt-4">
      <div className="flex items-end justify-between gap-2">
        <span className="text-sm font-medium text-white/80">Urnas apuradas</span>
        <span className="num text-4xl leading-none font-black tracking-tight text-ouro sm:text-5xl">
          {fmtPct(r.pctSecoes)}
        </span>
      </div>
      <div
        className="mt-3 h-3 overflow-hidden rounded-full bg-white/15"
        role="progressbar"
        aria-valuenow={r.pctSecoes}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Seções totalizadas"
      >
        <div
          className={`barra-ouro relative h-full overflow-hidden rounded-full transition-[width] duration-700 ${r.pctSecoes > 0 && !r.finalizado ? "brilho" : ""}`}
          style={{ width: `${r.pctSecoes}%` }}
        />
      </div>
      <p className="num mt-1.5 text-xs text-white/65">
        {fmtNum(r.secoesTotalizadas)} de {fmtNum(r.secoesTotal)} seções
      </p>
    </div>
  );
}

function CartaoCandidato({ c, lider }: { c: Candidato; lider: boolean }) {
  const cor = corCandidato(c.cor);
  return (
    <article
      className="relative flex flex-col items-center overflow-hidden rounded-2xl border-t-[5px] px-2 pt-4 pb-3 text-center transition-shadow sm:px-5 sm:pt-6 sm:pb-5"
      style={{
        borderTopColor: cor,
        background: `linear-gradient(180deg, color-mix(in oklab, ${cor} 18%, var(--surface)), color-mix(in oklab, ${cor} 4%, var(--surface)))`,
        boxShadow: lider ? `0 0 0 2px ${cor}, 0 12px 32px -12px ${cor}` : undefined,
      }}
    >
      {c.eleito && (
        <span
          className="mb-2 rounded-full px-3 py-0.5 text-[11px] font-black tracking-wide text-white uppercase"
          style={{ background: cor }}
        >
          ✓ Eleito
        </span>
      )}
      {lider && !c.eleito && (
        <span className="mb-2 rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-surface uppercase">
          Na frente
        </span>
      )}
      <div
        className="relative size-20 overflow-hidden rounded-full sm:size-28"
        style={{ boxShadow: `0 0 0 3px var(--surface), 0 0 0 6px ${cor}` }}
      >
        {c.foto ? (
          <Image src={c.foto} alt={`Foto de ${titulo(c.nome)}`} fill sizes="112px" className="object-cover" />
        ) : (
          <span className="grid size-full place-items-center bg-surface-2 text-3xl font-black text-ink-2">
            {c.nome.split(" ").at(-1)?.charAt(0)}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-[15px] leading-tight font-extrabold sm:text-xl">{titulo(c.nome)}</h3>
      <p className="mt-0.5 text-[11px] font-medium text-ink-2 sm:text-sm">
        {c.partido} · <span className="num">{c.numero}</span>
      </p>
      <p className="num mt-2 text-[2rem] leading-none font-black tracking-tight sm:text-6xl">{fmtPct(c.pct)}</p>
      <p className="num mt-1 text-[11px] text-ink-2 sm:text-sm">{fmtNum(c.votos)} votos</p>
      {c.vice && <p className="mt-1 hidden text-xs text-muted sm:block">Vice: {titulo(c.vice)}</p>}
    </article>
  );
}

function BarraDisputa({ candidatos }: { candidatos: Candidato[] }) {
  const total = candidatos.reduce((s, c) => s + c.votos, 0);
  return (
    <div className="mt-5">
      <div className="relative flex h-8 gap-0.5 overflow-hidden rounded-xl bg-vazio" aria-hidden>
        {total > 0 &&
          candidatos.map((c, i) => {
            const largura = (c.votos / total) * 100;
            return (
              <div
                key={c.sq}
                className={`flex h-full items-center px-2.5 text-xs font-bold text-white transition-[width] duration-700 ${i === 0 ? "justify-start" : "justify-end"}`}
                style={{ width: `${largura}%`, background: corCandidato(c.cor) }}
                title={`${titulo(c.nome)}: ${fmtPct(c.pct)}`}
              >
                {largura > 18 && <span className="num drop-shadow">{fmtPct(c.pct)}</span>}
              </div>
            );
          })}
        <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-surface" />
      </div>
      <div className="mt-1.5 flex justify-between text-xs font-medium text-ink-2">
        {candidatos.map((c) => (
          <span key={c.sq} className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-sm" style={{ background: corCandidato(c.cor) }} />
            {titulo(c.nome)}
          </span>
        ))}
      </div>
      <p className="mt-1 text-center text-[11px] text-muted">A linha central marca 50% dos votos válidos</p>
    </div>
  );
}

function Estat({ rotulo, valor, sub }: { rotulo: string; valor: string; sub: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <dt className="text-[11px] font-medium tracking-wide text-ink-2 uppercase">{rotulo}</dt>
      <dd className="num text-lg font-extrabold">{valor}</dd>
      <dd className="num text-xs text-muted">{sub}</dd>
    </div>
  );
}

function PlacarEsqueleto() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl bg-surface shadow-cartao">
      <div className="fundo-noite h-36" />
      <div className="grid grid-cols-2 gap-3 p-4">
        <div className="h-60 rounded-2xl bg-surface-2" />
        <div className="h-60 rounded-2xl bg-surface-2" />
      </div>
    </div>
  );
}
