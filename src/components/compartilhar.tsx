"use client";

import { useState } from "react";

export function Compartilhar({ texto, caminho = "/" }: { texto: string; caminho?: string }) {
  const [copiado, setCopiado] = useState(false);
  const url = () => `${window.location.origin}${caminho}`;

  const whatsapp = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${url()}`)}`, "_blank", "noopener");

  const copiar = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: texto, url: url() });
        return;
      }
      await navigator.clipboard.writeText(url());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {}
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={whatsapp}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1f8f4e] px-4 py-2.5 text-sm font-bold text-white shadow-md hover:brightness-110 sm:flex-none"
      >
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
        </svg>
        Mandar no WhatsApp
      </button>
      <button
        onClick={copiar}
        className="shrink-0 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-semibold hover:bg-surface-2"
      >
        {copiado ? "Copiado!" : "Compartilhar"}
      </button>
    </div>
  );
}
