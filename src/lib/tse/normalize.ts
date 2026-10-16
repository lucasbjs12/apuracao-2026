import { TSE_BASE, TSE_CICLO } from "@/config/site";
import type { Candidato, Resultado } from "./types";

// Estrutura bruta do arquivo "-u.json" do TSE (apenas os campos usados).
type RawCand = {
  n: string; sqcand: string; nm: string; nmu: string; st?: string;
  vap?: string; pvap?: string; vs?: { nmu?: string }[];
};
export type RawResultado = {
  ele: string; cdabr: string; dt?: string; ht?: string; tf?: string;
  carg: { agr: { par: { sg: string; cand: RawCand[] }[] }[] }[];
  s: { ts: string; st: string; pst: string };
  e: { te: string; c: string; pc: string; a: string; pa: string };
  v: { vv: string; vb: string; pvb: string; tvn: string; ptvn: string };
};

const num = (s?: string) => Number(s ?? 0) || 0;
const pct = (s?: string) => Number((s ?? "0").replace(",", ".")) || 0;

export function normalizar(raw: RawResultado, cargo: Resultado["cargo"]): Resultado {
  const uf = raw.cdabr;
  const fotoUf = cargo === "presidente" ? "br" : uf;

  const candidatos: Omit<Candidato, "cor">[] = [];
  for (const agr of raw.carg?.[0]?.agr ?? []) {
    for (const par of agr.par ?? []) {
      for (const c of par.cand ?? []) {
        candidatos.push({
          numero: c.n,
          sq: c.sqcand,
          nome: c.nmu,
          nomeCompleto: c.nm,
          partido: par.sg,
          vice: c.vs?.[0]?.nmu ?? null,
          votos: num(c.vap),
          pct: pct(c.pvap),
          eleito: /^eleit/i.test(c.st ?? ""),
          foto: `${TSE_BASE}/${TSE_CICLO}/${raw.ele}/fotos/${fotoUf}/${c.sqcand}.jpeg`,
        });
      }
    }
  }

  // Cor segue o candidato (ordem do número), nunca a posição na disputa.
  const ordemNumero = [...candidatos].sort((a, b) => Number(a.numero) - Number(b.numero));
  const comCor: Candidato[] = candidatos.map((c) => ({ ...c, cor: ordemNumero.indexOf(c) }));
  comCor.sort((a, b) => b.votos - a.votos || Number(a.numero) - Number(b.numero));

  return {
    eleicao: raw.ele,
    cargo,
    uf,
    atualizadoEm: raw.dt && raw.ht ? `${raw.dt} ${raw.ht}` : null,
    secoesTotal: num(raw.s?.ts),
    secoesTotalizadas: num(raw.s?.st),
    pctSecoes: pct(raw.s?.pst),
    eleitorado: num(raw.e?.te),
    comparecimento: num(raw.e?.c),
    pctComparecimento: pct(raw.e?.pc),
    abstencao: num(raw.e?.a),
    pctAbstencao: pct(raw.e?.pa),
    validos: num(raw.v?.vv),
    brancos: num(raw.v?.vb),
    pctBrancos: pct(raw.v?.pvb),
    nulos: num(raw.v?.tvn),
    pctNulos: pct(raw.v?.ptvn),
    finalizado: raw.tf === "s",
    candidatos: comCor,
  };
}
