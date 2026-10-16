import type { Metadata } from "next";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: "Política de privacidade" };

// Modelo básico. Revise com quem cuida da parte jurídica e preencha o contato antes de publicar.
export default function Privacidade() {
  const contato = process.env.NEXT_PUBLIC_CONTATO_EMAIL ?? "[seu e-mail de contato]";
  return (
    <article className="max-w-2xl space-y-4 leading-relaxed text-ink-2">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Política de privacidade</h1>
      <p>
        Esta política explica como o {SITE.nome} trata dados pessoais, conforme a Lei Geral de Proteção de Dados
        (Lei nº 13.709/2018).
      </p>
      <h2 className="pt-2 text-lg font-bold text-ink">Dados que coletamos</h2>
      <p>
        Não pedimos cadastro nem coletamos nome, e-mail ou documentos. Guardamos no seu navegador apenas a sua
        escolha sobre cookies.
      </p>
      <h2 className="pt-2 text-lg font-bold text-ink">Publicidade e cookies</h2>
      <p>
        Exibimos anúncios do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios
        com base em visitas anteriores a este e a outros sites. Se você escolher &quot;Só essenciais&quot;, solicitamos
        apenas anúncios não personalizados. Você também pode gerenciar a personalização em{" "}
        <a href="https://adssettings.google.com" className="underline" target="_blank" rel="noopener">
          adssettings.google.com
        </a>{" "}
        e saber mais em{" "}
        <a href="https://policies.google.com/technologies/ads" className="underline" target="_blank" rel="noopener">
          policies.google.com/technologies/ads
        </a>
        .
      </p>
      <h2 className="pt-2 text-lg font-bold text-ink">Hospedagem</h2>
      <p>
        O site é hospedado pela Vercel, que pode registrar dados técnicos de acesso (como endereço IP) para fins
        de segurança e funcionamento.
      </p>
      <h2 className="pt-2 text-lg font-bold text-ink">Contato</h2>
      <p>Dúvidas ou pedidos sobre seus dados: {contato}.</p>
    </article>
  );
}
