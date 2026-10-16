// Configuração central do site. Ajuste nome/URL via variáveis de ambiente na Vercel.

export const SITE = {
  nome: process.env.NEXT_PUBLIC_SITE_NAME ?? "Apuração ao Vivo 2026",
  descricao:
    "Acompanhe a apuração do 2º turno das Eleições 2026 em tempo real: Presidente e Governadores, com dados oficiais do TSE.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
};

// Base pública dos arquivos de resultado do TSE.
export const TSE_BASE = "https://resultados.tse.jus.br/oficial";
export const TSE_CICLO = "ele2026";

// Códigos das eleições (conferidos em /oficial/comum/config/ele-c.json).
export const ELEICOES = {
  presidente: { turno2: "6258", turno1: "6257", cargo: "0001" },
  governador: { turno2: "6260", turno1: "6259", cargo: "0003" },
} as const;

export type Cargo = keyof typeof ELEICOES;

// Estados com 2º turno para governador em 2026.
export const UFS_GOVERNADOR_2T = ["ac", "am", "df", "es", "rn", "to"] as const;

// As urnas fecham às 17h (horário de Brasília) em todo o país.
export const INICIO_APURACAO = new Date("2026-10-25T17:00:00-03:00");

// Intervalo de atualização no navegador (ms).
export const REFRESH_MS = 30_000;

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
export const AD_SLOTS = {
  topo: process.env.NEXT_PUBLIC_AD_SLOT_TOPO ?? "",
  meio: process.env.NEXT_PUBLIC_AD_SLOT_MEIO ?? "",
  rodape: process.env.NEXT_PUBLIC_AD_SLOT_RODAPE ?? "",
};

export const UFS: Record<string, string> = {
  ac: "Acre", al: "Alagoas", ap: "Amapá", am: "Amazonas", ba: "Bahia", ce: "Ceará",
  df: "Distrito Federal", es: "Espírito Santo", go: "Goiás", ma: "Maranhão",
  mt: "Mato Grosso", ms: "Mato Grosso do Sul", mg: "Minas Gerais", pa: "Pará",
  pb: "Paraíba", pr: "Paraná", pe: "Pernambuco", pi: "Piauí", rj: "Rio de Janeiro",
  rn: "Rio Grande do Norte", rs: "Rio Grande do Sul", ro: "Rondônia", rr: "Roraima",
  sc: "Santa Catarina", sp: "São Paulo", se: "Sergipe", to: "Tocantins",
  zz: "Exterior", br: "Brasil",
};

export const UFS_MAPA = Object.keys(UFS).filter((u) => u !== "br");
