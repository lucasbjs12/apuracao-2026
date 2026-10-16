"use client";

import { useSyncExternalStore } from "react";
import { INICIO_APURACAO } from "@/config/site";

// Relógio que avança a cada segundo (null no servidor, para não divergir na hidratação).
function assinarRelogio(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}
const segundoAtual = () => Math.floor(Date.now() / 1000) * 1000;

export function Contagem() {
  const agora = useSyncExternalStore(assinarRelogio, segundoAtual, () => null);
  if (agora === null) return null;

  const falta = INICIO_APURACAO.getTime() - agora;
  if (falta <= 0) return null;
  const d = Math.floor(falta / 86_400_000);
  const h = Math.floor((falta / 3_600_000) % 24);
  const m = Math.floor((falta / 60_000) % 60);
  const s = Math.floor((falta / 1000) % 60);
  const p = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="mt-4 rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/15 backdrop-blur">
      <p className="text-sm text-white/80">A apuração começa no domingo, 25 de outubro, às 17h (Brasília)</p>
      <p className="num mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
        {d > 0 && <>{d}d </>}
        {p(h)}:{p(m)}:{p(s)}
      </p>
    </div>
  );
}
