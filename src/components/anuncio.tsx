"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, AD_SLOTS } from "@/config/site";
import { lerConsentimento } from "./consentimento";

declare global {
  interface Window {
    adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number };
  }
}

// Bloco de anúncio do Google AdSense.
// Sem NEXT_PUBLIC_ADSENSE_CLIENT configurado, mostra um espaço reservado só em desenvolvimento.
export function Anuncio({ posicao }: { posicao: keyof typeof AD_SLOTS }) {
  const slot = AD_SLOTS[posicao];
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot || !ref.current || ref.current.dataset.carregado) return;
    try {
      const ads = (window.adsbygoogle = window.adsbygoogle || []);
      // Até o visitante aceitar cookies, só anúncios não personalizados (LGPD).
      ads.requestNonPersonalizedAds = lerConsentimento() === "aceito" ? 0 : 1;
      ads.push({});
      ref.current.dataset.carregado = "1";
    } catch {}
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-line text-xs text-muted">
        Espaço publicitário ({posicao})
      </div>
    );
  }

  return (
    <div className="min-h-24 text-center">
      <span className="block text-[10px] uppercase tracking-widest text-muted">Publicidade</span>
      <ins
        ref={ref}
        className="adsbygoogle block"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
