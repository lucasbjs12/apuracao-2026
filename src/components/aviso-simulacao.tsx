"use client";

import { useResultado } from "@/lib/hooks";

// Aparece só quando o servidor realmente devolveu dados simulados (ALLOW_DEMO=1 e ?demo=1).
export function AvisoSimulacao() {
  const { data } = useResultado("presidente", "br");
  if (!data?.simulacao) return null;
  return (
    <div className="sticky top-0 z-40 flex h-9 items-center justify-center bg-ouro px-4 text-center text-xs font-black text-black sm:text-sm">
      ⚠ SIMULAÇÃO: números fictícios<span className="hidden sm:inline">, não são resultados reais</span>
    </div>
  );
}
