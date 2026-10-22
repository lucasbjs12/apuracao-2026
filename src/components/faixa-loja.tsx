import Link from "next/link";
import { PRODUTOS } from "@/config/produtos";

// Chamada da loja na página inicial, logo depois do mapa e dos governadores.
export function FaixaLoja() {
  const amostra = PRODUTOS.slice(0, 4);
  return (
    <section className="fundo-noite overflow-hidden rounded-3xl p-5 shadow-cartao sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-ouro px-3 py-1 text-[11px] font-black tracking-wider text-black uppercase">
            Nova loja
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Produtos da eleição 2026
          </h2>
          <p className="mt-1 max-w-md text-sm text-white/80">
            Camisetas, adesivos e canecas para a noite da apuração. Toda compra ajuda a manter o site gratuito.
          </p>
          <Link
            href="/produtos"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ouro px-5 py-2.5 text-sm font-black text-black shadow-md hover:brightness-105"
          >
            Ver a loja →
          </Link>
        </div>
        <ul className="flex shrink-0 gap-2">
          {amostra.map((p) => (
            <li
              key={p.id}
              className="grid size-16 place-items-center rounded-2xl bg-white/10 text-3xl ring-1 ring-white/15 sm:size-20 sm:text-4xl"
              title={p.nome}
              aria-hidden
            >
              {p.emoji}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
