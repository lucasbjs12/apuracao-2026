const nf = new Intl.NumberFormat("pt-BR");
const pf = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtNum = (n: number) => nf.format(n);
export const fmtPct = (n: number) => `${pf.format(n)}%`;

// "Flavio Bolsonaro" em vez de "FLAVIO BOLSONARO"
export function titulo(s: string) {
  const minusculas = new Set(["da", "de", "do", "das", "dos", "e"]);
  return s
    .toLowerCase()
    .split(" ")
    .map((p, i) => (i > 0 && minusculas.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ");
}

export const corCandidato = (i: number) => `var(--cand-${i % 2})`;
