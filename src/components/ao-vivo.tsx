import type { Resultado } from "@/lib/tse/types";

type Props = {
  r: Pick<Resultado, "atualizadoEm" | "finalizado" | "desatualizado" | "pctSecoes">;
  claro?: boolean; // texto claro, para fundo escuro
};

export function AoVivo({ r, claro }: Props) {
  const hora = r.atualizadoEm?.split(" ")[1]?.slice(0, 5);
  const aoVivo = r.pctSecoes > 0 && !r.finalizado;
  const estado = r.finalizado ? "Encerrada" : aoVivo ? "Ao vivo" : "Aguardando";
  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${claro ? "text-white/75" : "text-ink-2"}`}>
      <span
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold tracking-wide uppercase ${
          aoVivo ? "bg-ao-vivo text-white" : claro ? "bg-white/15 text-white" : "bg-surface-2"
        }`}
      >
        <span className={`inline-block size-1.5 rounded-full ${aoVivo ? "pulso bg-white" : "bg-current opacity-70"}`} />
        {estado}
      </span>
      {hora && <span className="num">atualizado às {hora}</span>}
      {r.desatualizado && <span className="font-semibold text-ouro">TSE instável, exibindo último dado</span>}
    </div>
  );
}
