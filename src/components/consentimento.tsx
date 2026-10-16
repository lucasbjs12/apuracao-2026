"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const CHAVE = "consentimento-cookies";
type Escolha = "aceito" | "recusado";

export function lerConsentimento(): Escolha | null {
  try {
    return localStorage.getItem(CHAVE) as Escolha | null;
  } catch {
    return null;
  }
}

// Pequeno "store" para o React reagir à escolha salva no localStorage.
const ouvintes = new Set<() => void>();
const assinar = (cb: () => void) => {
  ouvintes.add(cb);
  return () => ouvintes.delete(cb);
};

export function BannerConsentimento() {
  // No servidor assume "já escolheu" para não piscar o banner antes da hidratação.
  const escolha = useSyncExternalStore(assinar, lerConsentimento, () => "aceito" as Escolha);

  const escolher = (e: Escolha) => {
    try {
      localStorage.setItem(CHAVE, e);
    } catch {}
    ouvintes.forEach((cb) => cb());
  };

  if (escolha !== null) return null;
  return (
    <div className="fixed inset-x-2 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 rounded-2xl border border-line bg-surface p-4 shadow-2xl md:inset-x-0 md:bottom-0 md:rounded-none">

      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-2">
          Usamos cookies para exibir anúncios que mantêm o site gratuito. Você pode aceitar anúncios
          personalizados ou continuar só com os essenciais.{" "}
          <Link href="/privacidade" className="underline">Política de privacidade</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => escolher("recusado")}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium hover:bg-surface-2"
          >
            Só essenciais
          </button>
          <button
            onClick={() => escolher("aceito")}
            className="rounded-full bg-ouro px-5 py-2 text-sm font-bold text-black"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
