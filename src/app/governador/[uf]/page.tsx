import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UFS, UFS_GOVERNADOR_2T } from "@/config/site";
import { Placar } from "@/components/placar";
import { Anuncio } from "@/components/anuncio";
import { Compartilhar } from "@/components/compartilhar";

export function generateStaticParams() {
  return UFS_GOVERNADOR_2T.map((uf) => ({ uf }));
}

export async function generateMetadata({ params }: PageProps<"/governador/[uf]">): Promise<Metadata> {
  const { uf } = await params;
  const nome = UFS[uf];
  return {
    title: `Governador ${nome}: apuração do 2º turno`,
    description: `Resultado da eleição para governador de ${nome} no 2º turno de 2026, atualizado em tempo real com dados do TSE.`,
  };
}

export default async function PaginaGovernador({ params }: PageProps<"/governador/[uf]">) {
  const { uf } = await params;
  if (!(UFS_GOVERNADOR_2T as readonly string[]).includes(uf)) notFound();
  const nome = UFS[uf];

  return (
    <div className="space-y-6">
      <nav className="text-sm text-ink-2">
        <Link href="/" className="hover:underline">Início</Link> / Governador / {nome}
      </nav>
      <div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Governador · {nome}</h1>
        <p className="mt-1 text-ink-2">Apuração do 2º turno, atualizada automaticamente.</p>
        <div className="mt-4">
          <Compartilhar texto={`Apuração para governador de ${nome} ao vivo:`} caminho={`/governador/${uf}`} />
        </div>
      </div>
      <Placar cargo="governador" uf={uf} rotulo={`Governador de ${nome}`} />
      <Anuncio posicao="meio" />
      <section>
        <h2 className="mb-3 font-bold">Outros estados</h2>
        <div className="flex flex-wrap gap-2">
          {UFS_GOVERNADOR_2T.filter((u) => u !== uf).map((u) => (
            <Link key={u} href={`/governador/${u}`} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm hover:bg-surface-2">
              {UFS[u]}
            </Link>
          ))}
          <Link href="/" className="rounded-full bg-ink px-3 py-1.5 text-sm text-surface">Presidente</Link>
        </div>
      </section>
    </div>
  );
}
