// Conteúdo explicativo (estático). Também ajuda no SEO e na aprovação do AdSense.

export const PERGUNTAS: { p: string; r: string }[] = [
  {
    p: "Quando a apuração começa?",
    r: "A votação vai das 8h às 17h, no horário de Brasília, em todo o país. Os resultados só começam a ser divulgados depois das 17h, quando todas as urnas estão fechadas. Nos primeiros minutos os números sobem rápido, porque muitas seções já transmitiram seus boletins.",
  },
  {
    p: "O que significa \"urnas apuradas\"?",
    r: "Cada seção eleitoral tem uma urna. Quando a votação termina, a urna imprime o Boletim de Urna (BU) com o total de votos daquela seção, e o arquivo é enviado ao TSE. O percentual de urnas apuradas mostra quantas seções já foram somadas ao resultado.",
  },
  {
    p: "O que são votos válidos?",
    r: "São os votos dados a um candidato. Votos brancos e nulos não entram na conta. Por isso as porcentagens dos dois candidatos sempre somam 100%. Vence quem tiver mais votos válidos.",
  },
  {
    p: "Por que a vantagem muda durante a noite?",
    r: "As urnas não chegam todas ao mesmo tempo. Regiões com mais seções ou com transmissão mais demorada entram no resultado mais tarde, e cada candidato costuma ter mais força em regiões diferentes. Por isso quem lidera no começo pode não ser quem termina na frente. O resultado só é definitivo quando o TSE declara o eleito.",
  },
  {
    p: "O que é \"matematicamente eleito\"?",
    r: "Acontece quando os votos que ainda faltam apurar não são suficientes para o segundo colocado virar a disputa, mesmo que ele recebesse todos eles. A partir daí o resultado já está definido, ainda que a apuração continue.",
  },
  {
    p: "O que é abstenção?",
    r: "É o eleitor que estava apto a votar e não compareceu. Quem não votou precisa justificar a ausência na Justiça Eleitoral. A abstenção é calculada sobre o eleitorado das seções já apuradas.",
  },
  {
    p: "Quem vota no 2º turno para governador?",
    r: "Só os eleitores dos estados em que nenhum candidato teve mais da metade dos votos válidos no 1º turno. Em 2026, haverá 2º turno para governador no Acre, Amazonas, Distrito Federal, Espírito Santo, Rio Grande do Norte e Tocantins.",
  },
];

export function Explicativo({ limite }: { limite?: number }) {
  const itens = limite ? PERGUNTAS.slice(0, limite) : PERGUNTAS;
  return (
    <div className="divide-y divide-line overflow-hidden rounded-3xl bg-surface shadow-cartao">
      {itens.map(({ p, r }, i) => (
        <details key={p} className="group p-4 sm:p-5" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {p}
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-lg leading-none text-ink transition-transform group-open:rotate-45 group-open:bg-ouro group-open:text-black">+</span>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{r}</p>
        </details>
      ))}
    </div>
  );
}
