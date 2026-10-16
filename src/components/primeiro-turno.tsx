import { cacheLife } from "next/cache";
import { getResultado } from "@/lib/tse/fetch";
import { fmtNum, fmtPct, titulo } from "@/lib/format";

// Resultado final do 1º turno (dado fechado, pode ficar em cache por dias).
async function dadosPrimeiroTurno() {
  "use cache";
  cacheLife("days");
  return getResultado("presidente", "br", { turno: 1 });
}

export async function PrimeiroTurno() {
  const r = await dadosPrimeiroTurno().catch(() => null);
  if (!r) return null;
  const top = r.candidatos.slice(0, 5);
  const max = top[0]?.pct || 1;

  return (
    <section className="rounded-3xl bg-surface p-4 shadow-cartao sm:p-6">
      <h2 className="text-xl font-black tracking-tight">Como foi o 1º turno (4 de outubro)</h2>
      <p className="text-sm text-ink-2">
        Presidente · {fmtNum(r.comparecimento)} eleitores votaram ({fmtPct(r.pctComparecimento)})
      </p>
      <ul className="mt-4 space-y-3">
        {top.map((c) => (
          <li key={c.sq}>
            <div className="flex justify-between gap-2 text-sm">
              <span>
                <span className="font-medium">{titulo(c.nome)}</span>{" "}
                <span className="text-xs text-muted">{c.partido}</span>
              </span>
              <span className="num font-semibold">{fmtPct(c.pct)}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-ink-2" style={{ width: `${(c.pct / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Nenhum candidato passou de 50% dos votos válidos, por isso os dois mais votados disputam o 2º turno.
      </p>
    </section>
  );
}
