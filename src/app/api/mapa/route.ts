import type { NextRequest } from "next/server";
import { demoPermitido, getMapaPresidente } from "@/lib/tse/fetch";

const CACHE = "public, max-age=15, s-maxage=20, stale-while-revalidate=60";

export async function GET(req: NextRequest) {
  const demo = demoPermitido(req.nextUrl.searchParams.get("demo"));
  try {
    const mapa = await getMapaPresidente({ demo });
    return Response.json(mapa, { headers: { "Cache-Control": demo ? "no-store" : CACHE } });
  } catch (err) {
    console.error(err);
    return Response.json({ erro: "Falha ao obter o mapa." }, { status: 502 });
  }
}
