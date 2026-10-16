# Apuração ao Vivo 2026

Site de acompanhamento da apuração do **2º turno das Eleições 2026** (25/10): Presidente e Governadores
(AC, AM, DF, ES, RN, TO). Os dados vêm dos arquivos públicos do TSE em `resultados.tse.jus.br`.

Stack: Next.js 16 (App Router) + React 19 + Tailwind 4 + SWR, hospedado na Vercel.

## Como funciona

```
Navegador ── a cada 30s ──► /api/resultado/... (CDN da Vercel, cache 15s) ──► TSE
```

- `src/lib/tse/fetch.ts` busca o JSON do TSE, guarda em memória por 15s e, se o TSE falhar, devolve o
  último dado válido (o site mostra "TSE instável, exibindo último dado").
- As rotas `/api/*` mandam `Cache-Control: s-maxage` para a CDN da Vercel: com milhares de visitantes,
  o TSE recebe poucas chamadas.
- `src/lib/tse/normalize.ts` converte as abreviações do TSE (`vap`, `pvap`, `pst`...) em campos legíveis.
- Os códigos das eleições ficam em `src/config/site.ts` (presidente `6258`, governador `6260`),
  conferidos em `https://resultados.tse.jus.br/oficial/comum/config/ele-c.json`.

| Rota | O que é |
|---|---|
| `/` | Presidente (placar, mapa por estado), governadores, explicações e resumo do 1º turno |
| `/governador/[uf]` | Placar de governador de cada estado com 2º turno |
| `/como-funciona` | Guia da apuração (conteúdo próprio, bom para SEO e AdSense) |
| `/sobre`, `/privacidade` | Páginas exigidas pelo AdSense |
| `/opengraph-image` | Imagem de prévia do WhatsApp com o placar do momento |
| `/ads.txt` | Gerado a partir de `NEXT_PUBLIC_ADSENSE_CLIENT` |

## Rodar localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra http://localhost:3000. Para testar com a apuração "andando", use **http://localhost:3000/?demo=1**.
A simulação usa números fictícios, nomes anônimos ("Candidato A/B") e mostra uma faixa amarela de
aviso. Ela só funciona com `ALLOW_DEMO=1`.

## Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Na Vercel: **Add New → Project**, importe o repositório (detecta Next.js automaticamente).
3. Em **Settings → Environment Variables**, cadastre as variáveis do `.env.example`
   (em **Production**, deixe `ALLOW_DEMO` vazio ou não cadastre).
4. Em **Settings → Domains**, adicione o seu domínio e ajuste o DNS conforme a Vercel indicar.
5. Atualize `NEXT_PUBLIC_SITE_URL` com o domínio final e faça um novo deploy.

## AdSense

1. Cadastre o domínio em https://adsense.google.com o quanto antes (a aprovação pode demorar).
2. Quando aprovado, preencha `NEXT_PUBLIC_ADSENSE_CLIENT` (`ca-pub-...`) e crie três blocos de anúncio
   (topo, meio, rodapé), colocando os IDs em `NEXT_PUBLIC_AD_SLOT_*`.
3. Confira `https://seudominio/ads.txt`.

Até o visitante aceitar cookies no banner, o site pede apenas anúncios **não personalizados** (LGPD).
Revise o texto de `/privacidade` e preencha `NEXT_PUBLIC_CONTATO_EMAIL`.

## Checklist do dia 25/10

- [ ] Até 24/10: abrir `https://resultados.tse.jus.br/oficial/comum/config/ele-c.json` e confirmar que
      os códigos `6258`/`6260` não mudaram.
- [ ] `ALLOW_DEMO` **desligado** em produção.
- [ ] Testar o link no WhatsApp (a prévia mostra o placar).
- [ ] A partir das 17h: acompanhar os logs da Vercel (**Project → Logs**) por mensagens `[tse]`.

## Cuidados

- Site independente: não use logo/brasão do TSE e mantenha o conteúdo neutro.
- Não publique pesquisas eleitorais sem registro no TSE.
- As cores dos candidatos (turquesa e roxo) foram escolhidas para não remeter a partidos e são
  legíveis por pessoas com daltonismo.
