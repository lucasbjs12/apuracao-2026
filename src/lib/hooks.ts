"use client";

import { useSyncExternalStore } from "react";
import useSWR from "swr";
import { REFRESH_MS } from "@/config/site";
import type { Mapa, Resultado } from "@/lib/tse/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.erro ?? "Erro ao carregar");
  return res.json();
};

// Lê ?demo=1 sem precisar de Suspense (useSearchParams exigiria).
const assinar = () => () => {};
export function useDemo() {
  return useSyncExternalStore(
    assinar,
    () => new URLSearchParams(window.location.search).get("demo") === "1",
    () => false,
  );
}

function useApi<T>(path: string | null) {
  const demo = useDemo();
  const url = path ? `${path}${demo ? (path.includes("?") ? "&" : "?") + "demo=1" : ""}` : null;
  return useSWR<T>(url, fetcher, {
    refreshInterval: demo ? 5_000 : REFRESH_MS,
    revalidateOnFocus: true,
    keepPreviousData: true,
    dedupingInterval: 5_000,
  });
}

export const useResultado = (cargo: "presidente" | "governador", uf: string, turno: 1 | 2 = 2) =>
  useApi<Resultado>(`/api/resultado/${cargo}/${uf}${turno === 1 ? "?turno=1" : ""}`);

export const useMapa = () => useApi<Mapa>("/api/mapa");
