"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { corCandidato, fmtPct, titulo } from "@/lib/format";
import { useResultado } from "@/lib/hooks";
import { ordenarParaExibir } from "./placar";

// Mini-placar que gruda no topo quando o placar principal sai da tela.
// Assim, quem está vendo o mapa ou os governadores não perde o resultado de vista.
export function PlacarFixo({ alvo }: { alvo: string }) {
  const { data } = useResultado("presidente", "br");
  const [visivel, setVisivel] = useState(false);
  const carregado = data !== undefined;

  useEffect(() => {
    const el = document.getElementById(alvo);
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting && e.boundingClientRect.top < 0));
    obs.observe(el);
    return () => obs.disconnect();
  }, [alvo, carregado]);

  if (!data || data.candidatos.length < 2) return null;
  const [a, b] = ordenarParaExibir(data.candidatos);
  const total = a.votos + b.votos;

  return (
    <div
      className={`fundo-noite fixed inset-x-0 z-30 shadow-lg transition-transform duration-300 ${data.simulacao ? "top-9" : "top-0"} ${visivel ? "translate-y-0" : "-translate-y-[150%]"}`}
      aria-hidden={!visivel}
    >
      <a href={`#${alvo}`} className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2">
        <Lado nome={titulo(a.nome)} pct={a.pct} cor={a.cor} />
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div className="flex h-2 w-full gap-px overflow-hidden rounded-full bg-white/15">
            {total > 0 && (
              <>
                <div style={{ width: `${(a.votos / total) * 100}%`, background: corCandidato(a.cor) }} />
                <div style={{ width: `${(b.votos / total) * 100}%`, background: corCandidato(b.cor) }} />
              </>
            )}
          </div>
          <span className="num text-[10px] font-semibold text-ouro">{fmtPct(data.pctSecoes)} apuradas</span>
        </div>
        <Lado nome={titulo(b.nome)} pct={b.pct} cor={b.cor} direita />
      </a>
    </div>
  );
}

function Lado({ nome, pct, cor, direita }: { nome: string; pct: number; cor: number; direita?: boolean }) {
  return (
    <div className={`flex shrink-0 flex-col ${direita ? "items-end" : "items-start"}`}>
      <span className="flex items-center gap-1 text-[11px] font-medium text-white/80">
        {!direita && <span className="size-2 rounded-sm" style={{ background: corCandidato(cor) }} />}
        <span className="max-w-24 truncate">{nome}</span>
        {direita && <span className="size-2 rounded-sm" style={{ background: corCandidato(cor) }} />}
      </span>
      <span className="num text-lg leading-tight font-black">{fmtPct(pct)}</span>
    </div>
  );
}

const ITENS = [
  { href: "/#placar", rotulo: "Presidente", icone: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z" },
  { href: "/#mapa", rotulo: "Estados", icone: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
  { href: "/#governadores", rotulo: "Governador", icone: "M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" },
  { href: "/como-funciona", rotulo: "Entenda", icone: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16v-4M12 8h.01" },
];

// Barra de navegação fixa no rodapé, só no celular (alcance fácil do polegar).
export function MenuInferior() {
  const caminho = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">
      <ul className="grid grid-cols-4">
        {ITENS.map((i) => {
          const ativo = i.href.startsWith("/#") ? caminho === "/" && i.href === "/#placar" : caminho.startsWith(i.href);
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${ativo ? "text-ink" : "text-muted"}`}
              >
                <span className={`mb-0.5 h-1 w-6 rounded-full ${ativo ? "bg-ouro" : "bg-transparent"}`} />
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d={i.icone} />
                </svg>
                {i.rotulo}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
