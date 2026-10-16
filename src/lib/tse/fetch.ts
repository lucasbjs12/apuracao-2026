import "server-only";
import { ELEICOES, TSE_BASE, TSE_CICLO, UFS_MAPA, type Cargo } from "@/config/site";
import { normalizar, type RawResultado } from "./normalize";
import { simular } from "./demo";
import type { Mapa, Resultado } from "./types";

// Cache em memória por instância: evita bater no TSE a cada visitante e guarda o
// último dado válido para quando o TSE estiver lento ou fora do ar.
// A CDN da Vercel (Cache-Control nas rotas /api) é a primeira camada de proteção.
const TTL_MS = 15_000;
type Entry = { at: number; data: RawResultado; pending?: Promise<RawResultado> };
const mem = new Map<string, Entry>();

async function baixar(url: string): Promise<RawResultado> {
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8_000) });
  if (!res.ok) throw new Error(`TSE ${res.status} em ${url}`);
  return (await res.json()) as RawResultado;
}

async function getRaw(url: string): Promise<{ data: RawResultado; stale: boolean }> {
  const hit = mem.get(url);
  const now = Date.now();
  if (hit && now - hit.at < TTL_MS) return { data: hit.data, stale: false };

  if (hit?.pending) {
    // Outra requisição já está buscando; responde com o que temos.
    return { data: hit.data, stale: false };
  }

  const pending = baixar(url);
  if (hit) hit.pending = pending;
  try {
    const data = await pending;
    mem.set(url, { at: Date.now(), data });
    return { data, stale: false };
  } catch (err) {
    if (hit) {
      hit.pending = undefined;
      console.error("[tse] usando último dado válido:", err);
      return { data: hit.data, stale: true };
    }
    throw err;
  }
}

function urlResultado(cargo: Cargo, uf: string, turno: 1 | 2) {
  const { cargo: cd, turno1, turno2 } = ELEICOES[cargo];
  const ele = turno === 2 ? turno2 : turno1;
  return `${TSE_BASE}/${TSE_CICLO}/${ele}/dados/${uf}/${uf}-c${cd}-e00${ele}-u.json`;
}

export async function getResultado(
  cargo: Cargo,
  uf: string,
  opts: { turno?: 1 | 2; demo?: boolean } = {},
): Promise<Resultado> {
  const { data, stale } = await getRaw(urlResultado(cargo, uf, opts.turno ?? 2));
  const r = normalizar(data, cargo);
  if (stale) r.desatualizado = true;
  return opts.demo ? simular(r, `${cargo}-${uf}`) : r;
}

export async function getMapaPresidente(opts: { demo?: boolean } = {}): Promise<Mapa> {
  const todos = await Promise.allSettled(
    UFS_MAPA.map((uf) => getResultado("presidente", uf, { demo: opts.demo })),
  );
  const ufs = todos
    .filter((t): t is PromiseFulfilledResult<Resultado> => t.status === "fulfilled")
    .map(({ value: r }) => ({
      uf: r.uf,
      pctSecoes: r.pctSecoes,
      finalizado: r.finalizado,
      candidatos: r.candidatos,
    }));
  const datas = todos
    .map((t) => (t.status === "fulfilled" ? t.value.atualizadoEm : null))
    .filter(Boolean) as string[];
  return { atualizadoEm: datas.sort().at(-1) ?? null, ufs, simulacao: opts.demo };
}

// Simulação só é permitida quando ALLOW_DEMO=1 (nunca ligue em produção na noite da eleição).
export function demoPermitido(param: string | null) {
  return param === "1" && process.env.ALLOW_DEMO === "1";
}
