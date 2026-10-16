import type { Metadata } from "next";
import { Explicativo } from "@/components/explicativo";
import { Anuncio } from "@/components/anuncio";

export const metadata: Metadata = {
  title: "Como funciona a apuração",
  description:
    "Entenda como os votos são contados no 2º turno: urnas apuradas, votos válidos, brancos e nulos, abstenção e quando um candidato é considerado eleito.",
};

export default function ComoFunciona() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Como funciona a apuração</h1>
        <p className="mt-2 max-w-2xl text-ink-2">
          Um guia rápido para entender os números que aparecem durante a noite da eleição.
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-4">
        {[
          ["1", "Votação", "Das 8h às 17h (Brasília), o eleitor vota na urna eletrônica da sua seção."],
          ["2", "Boletim de Urna", "Às 17h a urna é encerrada e imprime o BU com os votos daquela seção."],
          ["3", "Transmissão", "O arquivo do BU é enviado, de forma criptografada, para o TSE."],
          ["4", "Totalização", "O TSE soma os boletins e publica o resultado, que este site exibe."],
        ].map(([n, t, d]) => (
          <li key={n} className="rounded-3xl bg-surface p-4 shadow-cartao">
            <span className="num grid size-7 place-items-center rounded-full bg-ouro text-sm font-black text-black">{n}</span>
            <h2 className="mt-3 font-bold">{t}</h2>
            <p className="mt-1 text-sm text-ink-2">{d}</p>
          </li>
        ))}
      </ol>

      <Anuncio posicao="meio" />

      <section>
        <h2 className="mb-4 text-lg font-bold">Perguntas frequentes</h2>
        <Explicativo />
      </section>
    </div>
  );
}
