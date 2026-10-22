import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PRODUTOS, WHATSAPP_LOJA, type Produto } from "@/config/produtos";

export const metadata: Metadata = {
  title: "Loja",
  description: "Produtos para acompanhar a noite da eleição: camisetas, adesivos, canecas e mais.",
};

const preco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function linkCompra(p: Produto) {
  if (p.link) return p.link;
  if (!WHATSAPP_LOJA) return null;
  const texto = `Olá! Quero comprar: ${p.nome} (${preco.format(p.preco)}).`;
  return `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(texto)}`;
}

export default function Produtos() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-ouro px-3 py-1 text-[11px] font-black tracking-wider text-black uppercase">
          Loja · Eleições 2026
        </span>
        <h1 className="mt-3 text-[2rem] leading-[1.05] font-black tracking-tight sm:text-5xl">
          Produtos para a{" "}
          <span className="relative z-0 inline-block">
            noite da eleição
            <span className="absolute inset-x-0 bottom-[0.1em] -z-10 h-[0.35em] rounded-sm bg-ouro" aria-hidden />
          </span>
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-2 sm:text-base">
          Camisetas, adesivos e mais para celebrar o voto, seja qual for o resultado. Toda compra ajuda a manter
          a apuração gratuita.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {PRODUTOS.map((p) => (
          <CartaoProduto key={p.id} p={p} />
        ))}
      </ul>

      <section className="rounded-3xl bg-surface p-4 text-sm text-ink-2 shadow-cartao sm:p-6">
        <h2 className="text-base font-black text-ink">Como funciona a compra</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5">
          <li>Escolha o produto e toque em <strong className="text-ink">Comprar</strong>.</li>
          <li>Você é levado ao <strong className="text-ink">pagamento seguro do Mercado Pago</strong> (Pix, cartão ou boleto).</li>
          <li>Após o pagamento, combinamos a entrega e o frete pelo contato informado.</li>
        </ol>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-xs font-semibold text-ink-2">
          <span aria-hidden>🔒</span>
          Pagamento processado pelo Mercado Pago. Não recebemos os dados do seu cartão.
        </div>
        <p className="mt-3 text-xs text-muted">
          Produtos sem vínculo com partidos, candidatos ou com o TSE.
        </p>
      </section>

      <Link
        href="/"
        className="flex items-center justify-center rounded-full border border-line bg-surface px-4 py-3 text-sm font-bold hover:bg-surface-2"
      >
        ← Voltar para a apuração
      </Link>
    </div>
  );
}

function CartaoProduto({ p }: { p: Produto }) {
  const href = linkCompra(p);
  return (
    <li className="flex flex-col overflow-hidden rounded-3xl bg-surface shadow-cartao">
      <div className="fundo-noite relative grid aspect-[4/3] place-items-center">
        {p.imagem ? (
          <Image src={p.imagem} alt={p.nome} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        ) : (
          <span className="text-7xl drop-shadow-lg" aria-hidden>
            {p.emoji}
          </span>
        )}
        {p.destaque && (
          <span className="absolute top-3 left-3 rounded-full bg-ouro px-2.5 py-0.5 text-[11px] font-black tracking-wide text-black uppercase">
            {p.destaque}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-lg leading-tight font-extrabold">{p.nome}</h2>
        <p className="mt-1 flex-1 text-sm text-ink-2">{p.descricao}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="num text-2xl font-black">{preco.format(p.preco)}</span>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-ouro px-5 py-2.5 text-sm font-black text-black shadow-md hover:brightness-105"
            >
              Comprar
            </a>
          ) : (
            <span className="rounded-full bg-surface-2 px-4 py-2.5 text-sm font-bold text-muted">Em breve</span>
          )}
        </div>
      </div>
    </li>
  );
}
