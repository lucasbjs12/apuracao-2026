import { ELEICOES, TSE_BASE, TSE_CICLO, UFS_MAPA, type Cargo } from "@/config/site";
import { normalizar, type RawResultado } from "./normalize";
import { simular } from "./demo";
import type { Mapa, Resultado } from "./types";

// O site é estático: o navegador de cada visitante busca os arquivos direto no TSE,
// que libera acesso de qualquer site (CORS) e serve tudo pela própria CDN.
// Também é usado no build, para gerar o resumo do 1º turno.

function urlResultado(cargo: Cargo, uf: string, turno: 1 | 2) {
  const { cargo: cd, turno1, turno2 } = ELEICOES[cargo];
  const ele = turno === 2 ? turno2 : turno1;
  return `${TSE_BASE}/${TSE_CICLO}/${ele}/dados/${uf}/${uf}-c${cd}-e00${ele}-u.json`;
}

async function baixar(url: string): Promise<RawResultado> {
  // No navegador, "no-cache" = sempre confere com o TSE (resposta 304 quando nada mudou, bem leve).
  // No build (servidor), "force-cache" deixa o Next gerar a página como estática.
  const cache = typeof window === "undefined" ? "force-cache" : "no-cache";
  const res = await fetch(url, { cache, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`TSE respondeu ${res.status}`);
  return (await res.json()) as RawResultado;
}

export async function carregarResultado(
  cargo: Cargo,
  uf: string,
  opts: { turno?: 1 | 2; demo?: boolean } = {},
): Promise<Resultado> {
  const r = normalizar(await baixar(urlResultado(cargo, uf, opts.turno ?? 2)), cargo);
  return opts.demo ? simular(r, `${cargo}-${uf}`) : r;
}

export async function carregarMapaPresidente(opts: { demo?: boolean } = {}): Promise<Mapa> {
  const todos = await Promise.allSettled(UFS_MAPA.map((uf) => carregarResultado("presidente", uf, opts)));
  const ok = todos.filter((t): t is PromiseFulfilledResult<Resultado> => t.status === "fulfilled").map((t) => t.value);
  if (ok.length === 0) throw new Error("Falha ao carregar o mapa");
  return {
    atualizadoEm: ok.map((r) => r.atualizadoEm).filter((d): d is string => !!d).sort().at(-1) ?? null,
    ufs: ok.map(({ uf, pctSecoes, finalizado, candidatos }) => ({ uf, pctSecoes, finalizado, candidatos })),
    simulacao: opts.demo,
  };
}
