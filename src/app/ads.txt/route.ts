import { ADSENSE_CLIENT } from "@/config/site";

// O AdSense exige /ads.txt na raiz do domínio. Gerado a partir de NEXT_PUBLIC_ADSENSE_CLIENT.
export function GET() {
  const pub = ADSENSE_CLIENT.replace(/^ca-/, "");
  const corpo = pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : "";
  return new Response(corpo, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
