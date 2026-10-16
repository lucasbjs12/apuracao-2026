# Apuração ao Vivo 2026

Site de acompanhamento da apuração do **2º turno das Eleições 2026** (25/10): Presidente e Governadores
(AC, AM, DF, ES, RN, TO). Os dados vêm dos arquivos públicos do TSE em `resultados.tse.jus.br`.

Stack: Next.js 16 (export estático) + React 19 + Tailwind 4 + SWR, hospedado na Cloudflare.

## Como funciona

```
Navegador do visitante ── a cada 30s ──► arquivos JSON do TSE (CDN do próprio TSE)
```

- O site é **100% estático** (pasta `out/`): não há servidor nem API própria. Hospedagem grátis e sem
  limite de acessos.
- O navegador busca os resultados direto no TSE, que libera acesso de qualquer site (CORS).
- `src/lib/tse/carregar.ts` baixa e normaliza os dados; `src/lib/tse/normalize.ts` converte as
  abreviações do TSE (`vap`, `pvap`, `pst`...) em campos legíveis.
- Se o TSE falhar, a página mantém o último dado válido e mostra "TSE instável, exibindo último dado".
- O placar atualiza a cada 30s; o mapa (28 arquivos, um por estado) a cada 60s.
- Os códigos das eleições ficam em `src/config/site.ts` (presidente `6258`, governador `6260`),
  conferidos em `https://resultados.tse.jus.br/oficial/comum/config/ele-c.json`.

| Página | O que é |
|---|---|
| `/` | Presidente (placar, mapa por estado), governadores, explicações e resumo do 1º turno |
| `/governador/[uf]/` | Placar de governador de cada estado com 2º turno |
| `/como-funciona/` | Guia da apuração (conteúdo próprio, bom para SEO e AdSense) |
| `/sobre/`, `/privacidade/` | Páginas exigidas pelo AdSense |
| `/opengraph-image` | Imagem de prévia do WhatsApp (convite fixo, gerado no build, sem números) |
| `/ads.txt` | Gerado no build a partir de `NEXT_PUBLIC_ADSENSE_CLIENT` |

## Rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra http://localhost:3000. Para testar com a apuração "andando", use **http://localhost:3000/?demo=1**.
A simulação usa números fictícios, nomes anônimos ("Candidato A/B") e mostra uma faixa amarela de
aviso. Ela só existe em builds com `NEXT_PUBLIC_ALLOW_DEMO=1`.

Para ver exatamente o que vai para o ar:

```bash
npm run build
python -m http.server 4173 --directory out
```

> Não rode `npm run build` com o `npm run dev` aberto: os dois usam a pasta `.next` e o CSS quebra.

## Deploy na Cloudflare

1. No painel da Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** e escolha o
   repositório `apuracao-2026`.
2. Configuração do build:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
3. Em **Environment variables**, cadastre as variáveis do `.env.example`
   (**não** cadastre `NEXT_PUBLIC_ALLOW_DEMO` em produção).
4. **Save and Deploy**. Sai um endereço `*.pages.dev` para testar.
5. Em **Custom domains**, adicione o seu domínio. Se o DNS do domínio já está na Cloudflare, é automático.
6. Como o site é estático, mudou uma variável → faça um novo deploy (**Deployments → Retry deployment**).

O arquivo `public/_headers` define cache longo para os arquivos do build e o tipo da imagem de prévia.

## AdSense

1. Cadastre o domínio em https://adsense.google.com o quanto antes (a aprovação pode demorar).
2. Quando aprovado, preencha `NEXT_PUBLIC_ADSENSE_CLIENT` (`ca-pub-...`) e crie três blocos de anúncio
   (topo, meio, rodapé), colocando os IDs em `NEXT_PUBLIC_AD_SLOT_*`. Faça um novo deploy.
3. Confira `https://seudominio/ads.txt`.

Até o visitante aceitar cookies no banner, o site pede apenas anúncios **não personalizados** (LGPD).
Revise o texto de `/privacidade` e preencha `NEXT_PUBLIC_CONTATO_EMAIL`.

## Checklist do dia 25/10

- [ ] Até 24/10: abrir `https://resultados.tse.jus.br/oficial/comum/config/ele-c.json` e confirmar que
      os códigos `6258`/`6260` não mudaram.
- [ ] `NEXT_PUBLIC_ALLOW_DEMO` **ausente** nas variáveis de produção.
- [ ] Testar o link no WhatsApp (a prévia aparece).
- [ ] A partir das 17h: abrir o site no celular e no computador e conferir que os números sobem.

## Limitações conhecidas

- No console do navegador podem aparecer erros 404 de arquivos `__next.*.__PAGE__.txt`: são
  pré-carregamentos do Next.js 16 no modo estático. A navegação funciona normalmente.

## Cuidados

- Site independente: não use logo/brasão do TSE e mantenha o conteúdo neutro.
- Não publique pesquisas eleitorais sem registro no TSE.
- As cores dos candidatos (turquesa e roxo) foram escolhidas para não remeter a partidos e são
  legíveis por pessoas com daltonismo.
