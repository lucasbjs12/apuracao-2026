import type { Resultado } from "./types";

// Simulação de apuração para testar o site antes do dia 25/10.
// Usa os candidatos reais do 2º turno, mas os NÚMEROS SÃO FICTÍCIOS.
// Um ciclo completo (0% → 100%) dura 8 minutos e recomeça.

const CICLO_MS = 8 * 60_000;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function simular(r: Resultado, chave: string, agora = Date.now()): Resultado {
  if (r.candidatos.length < 2) return { ...r, simulacao: true };

  const h = hash(chave);
  const velocidade = 0.85 + (h % 30) / 100;
  const t = (agora % CICLO_MS) / CICLO_MS;
  const p = Math.min(1, t * 1.2 * velocidade);

  // Participação base do candidato de cor 0 entre 40% e 60%, com "virada" ao longo da noite.
  const base = 0.4 + ((h >>> 4) % 21) / 100;
  const deriva = (0.5 - p) * 0.1 * (h & 1 ? 1 : -1);
  const share0 = Math.min(0.75, Math.max(0.25, base + deriva));

  const eleitoradoApurado = Math.round(r.eleitorado * p);
  const comparecimento = Math.round(eleitoradoApurado * 0.79);
  const abstencao = eleitoradoApurado - comparecimento;
  const brancos = Math.round(comparecimento * 0.018);
  const nulos = Math.round(comparecimento * 0.029);
  const validos = comparecimento - brancos - nulos;
  const v0 = Math.round(validos * share0);
  const pctDe = (v: number, total: number) => (total ? (v / total) * 100 : 0);
  const finalizado = p >= 1;

  // Nomes e fotos anonimizados: um print da simulação nunca pode parecer resultado real.
  const candidatos = r.candidatos
    .map((c) => {
      const votos = c.cor === 0 ? v0 : validos - v0;
      const letra = String.fromCharCode(65 + c.cor);
      return {
        ...c,
        numero: letra,
        nome: `CANDIDATO ${letra}`,
        nomeCompleto: `CANDIDATO ${letra} (SIMULAÇÃO)`,
        partido: "SIMULAÇÃO",
        vice: null,
        foto: "",
        votos,
        pct: pctDe(votos, validos),
        eleito: false,
      };
    })
    .sort((a, b) => b.votos - a.votos);
  if (finalizado) candidatos[0].eleito = true;

  const d = new Date(agora);
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).format(d).replace(",", "");

  return {
    ...r,
    atualizadoEm: fmt,
    secoesTotalizadas: Math.round(r.secoesTotal * p),
    pctSecoes: p * 100,
    comparecimento,
    pctComparecimento: pctDe(comparecimento, eleitoradoApurado),
    abstencao,
    pctAbstencao: pctDe(abstencao, eleitoradoApurado),
    validos,
    brancos,
    pctBrancos: pctDe(brancos, comparecimento),
    nulos,
    pctNulos: pctDe(nulos, comparecimento),
    finalizado,
    candidatos,
    simulacao: true,
  };
}
