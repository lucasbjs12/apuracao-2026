// Catálogo da loja. Edite aqui para adicionar, remover ou mudar produtos.
//
// Como cada produto é vendido:
// - "link": link de pagamento do Mercado Pago (campo recomendado). Tem prioridade.
//   Crie um link por produto no painel do Mercado Pago (Seu negócio > Link de pagamento)
//   e cole a URL aqui, ex.: "https://mpago.la/xxxxxxx".
// - sem "link": o botão abre o WhatsApp de vendas (NEXT_PUBLIC_WHATSAPP_LOJA) com o pedido escrito.
// - sem "link" e sem WhatsApp configurado: aparece "Em breve" (nada é vendido por engano).
//
// Atenção: evite produtos com nome, foto ou número de candidatos (direito de imagem e lei eleitoral).

export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: number; // em reais
  emoji: string; // ilustração enquanto não houver foto
  imagem?: string; // ex.: "/produtos/camiseta.jpg" (coloque o arquivo em public/produtos/)
  link?: string;
  destaque?: string; // selo opcional, ex.: "Mais vendido"
};

export const PRODUTOS: Produto[] = [
  {
    id: "camiseta-eu-votei",
    nome: "Camiseta \"Eu votei 2026\"",
    descricao: "Algodão, estampa frontal. Tamanhos P ao GG.",
    preco: 59.9,
    emoji: "👕",
    destaque: "Mais pedido",
    link: "https://mpago.la/1LBUHQS",
  },
  {
    id: "adesivos-eu-votei",
    nome: "Kit de adesivos \"Eu votei\"",
    descricao: "5 adesivos de vinil para notebook, celular ou garrafa.",
    preco: 14.9,
    emoji: "🏷️",
    link: "https://mpago.la/1ZhpT4b",
  },
  {
    id: "caneca-apuracao",
    nome: "Caneca \"Noite da apuração\"",
    descricao: "Porcelana 325 ml, para acompanhar a contagem até o fim.",
    preco: 44.9,
    emoji: "☕",
    link: "https://mpago.la/1ibbYq1",
  },
  {
    id: "boné-democracia",
    nome: "Boné \"Democracia\"",
    descricao: "Aba curva, ajuste traseiro. Bordado.",
    preco: 49.9,
    emoji: "🧢",
    link: "https://mpago.la/21jMin9",
  },
];

export const WHATSAPP_LOJA = (process.env.NEXT_PUBLIC_WHATSAPP_LOJA ?? "").replace(/\D/g, "");
