// Formato normalizado que o site usa (independente das abreviações do TSE).

export type Candidato = {
  numero: string;
  sq: string;
  nome: string;
  nomeCompleto: string;
  partido: string;
  vice: string | null;
  votos: number;
  pct: number; // % dos votos válidos
  eleito: boolean;
  foto: string;
  cor: number; // índice fixo de cor, pela ordem do número na urna
};

export type Resultado = {
  eleicao: string;
  cargo: "presidente" | "governador";
  uf: string;
  atualizadoEm: string | null; // "dd/mm/aaaa hh:mm:ss" (horário de Brasília)
  secoesTotal: number;
  secoesTotalizadas: number;
  pctSecoes: number;
  eleitorado: number;
  comparecimento: number;
  pctComparecimento: number;
  abstencao: number;
  pctAbstencao: number;
  validos: number;
  brancos: number;
  pctBrancos: number;
  nulos: number;
  pctNulos: number;
  finalizado: boolean;
  candidatos: Candidato[];
  simulacao?: boolean;
  desatualizado?: boolean; // servido do cache porque o TSE falhou
};

export type MapaUF = Pick<Resultado, "uf" | "pctSecoes" | "candidatos" | "finalizado">;
export type Mapa = { atualizadoEm: string | null; ufs: MapaUF[]; simulacao?: boolean };
