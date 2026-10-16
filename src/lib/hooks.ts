"use client";

import { useSyncExternalStore } from "react";
import useSWR from "swr";
import { REFRESH_MS, type Cargo } from "@/config/site";
import { carregarMapaPresidente, carregarResultado } from "@/lib/tse/carregar";

// Simulação só existe em builds com NEXT_PUBLIC_ALLOW_DEMO=1 (nunca no site de produção).
const DEMO_PERMITIDO = process.env.NEXT_PUBLIC_ALLOW_DEMO === "1";

// Lê ?demo=1 sem precisar de Suspense (useSearchParams exigiria).
const assinar = () => () => {};
export function useDemo() {
  return useSyncExternalStore(
    assinar,
    () => DEMO_PERMITIDO && new URLSearchParams(window.location.search).get("demo") === "1",
    () => false,
  );
}

const opcoes = (demo: boolean, intervalo: number) => ({
  refreshInterval: demo ? 5_000 : intervalo,
  revalidateOnFocus: true,
  keepPreviousData: true,
  dedupingInterval: 5_000,
  errorRetryInterval: 10_000,
});

// Se o TSE falhar, o SWR mantém o último dado válido; marcamos como "desatualizado".
export function useResultado(cargo: Cargo, uf: string, turno: 1 | 2 = 2) {
  const demo = useDemo();
  const swr = useSWR(
    ["resultado", cargo, uf, turno, demo] as const,
    ([, c, u, t, d]) => carregarResultado(c, u, { turno: t, demo: d }),
    opcoes(demo, REFRESH_MS),
  );
  const data = swr.data && swr.error ? { ...swr.data, desatualizado: true } : swr.data;
  return { ...swr, data };
}

// O mapa baixa um arquivo por estado (28), então atualiza com menos frequência.
export function useMapa() {
  const demo = useDemo();
  return useSWR(["mapa", demo] as const, ([, d]) => carregarMapaPresidente({ demo: d }), opcoes(demo, 60_000));
}
