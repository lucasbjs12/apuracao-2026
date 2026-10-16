import type { Metadata } from "next";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: "Sobre" };

export default function Sobre() {
  return (
    <article className="max-w-2xl space-y-4 leading-relaxed text-ink-2">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Sobre o {SITE.nome}</h1>
      <p>
        O {SITE.nome} é um site independente criado para facilitar o acompanhamento da apuração do 2º turno das
        Eleições 2026, de um jeito simples e rápido de abrir no celular.
      </p>
      <p>
        Todos os números exibidos vêm dos arquivos públicos de resultados divulgados pelo Tribunal Superior
        Eleitoral (TSE). Não produzimos estimativas, projeções nem pesquisas eleitorais.
      </p>
      <p>
        Não temos vínculo com o TSE, com partidos políticos ou com candidatos. O site é mantido com publicidade.
        Em caso de qualquer divergência, prevalece o resultado oficial publicado em{" "}
        <a href="https://resultados.tse.jus.br" className="underline" target="_blank" rel="noopener">
          resultados.tse.jus.br
        </a>
        .
      </p>
    </article>
  );
}
