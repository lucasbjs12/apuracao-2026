import Link from "next/link";
import { Suspense } from "react";
import { Placar } from "@/components/placar";
import { MapaBrasil } from "@/components/mapa-brasil";
import { Governadores } from "@/components/governadores";
import { Explicativo } from "@/components/explicativo";
import { PrimeiroTurno } from "@/components/primeiro-turno";
import { Anuncio } from "@/components/anuncio";
import { Compartilhar } from "@/components/compartilhar";
import { PlacarFixo } from "@/components/celular";

export default function Home() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <PlacarFixo alvo="placar" />

      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-ouro px-3 py-1 text-[11px] font-black tracking-wider text-black uppercase">
          Eleições 2026 · 2º turno
        </span>
        <h1 className="mt-3 text-[2rem] leading-[1.05] font-black tracking-tight sm:text-5xl">
          Apuração{" "}
          <span className="relative z-0 inline-block">
            ao vivo
            <span className="absolute inset-x-0 bottom-[0.1em] -z-10 h-[0.35em] rounded-sm bg-ouro" aria-hidden />
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-2 sm:text-base">
          Presidente e Governador com os dados oficiais do TSE. Domingo, 25 de outubro. A página se atualiza
          sozinha.
        </p>
        <div className="mt-4">
          <Compartilhar texto="Acompanhe a apuração do 2º turno ao vivo:" />
        </div>
      </div>

      <div id="placar" className="scroll-mt-20">
        <Placar cargo="presidente" uf="br" rotulo="Presidente da República" />
      </div>

      <Anuncio posicao="topo" />

      <div id="mapa" className="scroll-mt-20">
        <MapaBrasil />
      </div>

      <div id="governadores" className="scroll-mt-20">
        <Governadores />
      </div>

      <Anuncio posicao="meio" />

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-xl font-black tracking-tight">Entenda a apuração</h2>
          <Link href="/como-funciona" className="text-sm font-semibold text-ink-2 underline">Ver tudo</Link>
        </div>
        <Explicativo limite={4} />
      </section>

      <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-surface-2" />}>
        <PrimeiroTurno />
      </Suspense>

      <Anuncio posicao="rodape" />
    </div>
  );
}
