import Link from "next/link";
import { SITE } from "@/config/site";

export function Cabecalho() {
  return (
    <header className="fundo-noite">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-ouro text-sm font-black text-black shadow-md">
            ✓
          </span>
          <span className="text-[15px] sm:text-base">{SITE.nome}</span>
        </Link>
        <nav className="hidden gap-1 text-sm font-medium md:flex">
          <Link href="/#mapa" className="rounded-full px-3 py-1.5 text-white/80 hover:bg-white/10 hover:text-white">Mapa</Link>
          <Link href="/#governadores" className="rounded-full px-3 py-1.5 text-white/80 hover:bg-white/10 hover:text-white">Governadores</Link>
          <Link href="/como-funciona" className="rounded-full px-3 py-1.5 text-white/80 hover:bg-white/10 hover:text-white">Como funciona</Link>
          <Link href="/produtos" className="rounded-full bg-ouro px-3 py-1.5 font-bold text-black hover:brightness-105">Loja</Link>
        </nav>
      </div>
    </header>
  );
}

export function Rodape() {
  return (
    <footer className="mt-12 border-t border-line bg-surface pb-20 md:pb-0">
      <div className="mx-auto max-w-5xl space-y-3 px-4 py-8 text-sm text-ink-2">
        <p>
          <strong className="text-ink">Fonte dos dados:</strong> resultados oficiais divulgados pelo Tribunal
          Superior Eleitoral em{" "}
          <a href="https://resultados.tse.jus.br" className="underline" target="_blank" rel="noopener">
            resultados.tse.jus.br
          </a>
          . Este é um site independente, sem vínculo com o TSE, partidos ou candidatos.
        </p>
        <p className="text-xs text-muted">
          Os números são atualizados automaticamente a cada 30 segundos. Em caso de divergência, vale o resultado
          publicado pelo TSE.
        </p>
        <nav className="flex flex-wrap gap-4 pt-2 text-xs">
          <Link href="/como-funciona" className="hover:underline">Como funciona a apuração</Link>
          <Link href="/sobre" className="hover:underline">Sobre</Link>
          <Link href="/privacidade" className="hover:underline">Política de privacidade</Link>
        </nav>
      </div>
    </footer>
  );
}
