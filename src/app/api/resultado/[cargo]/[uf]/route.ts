import type { NextRequest } from "next/server";
import { ELEICOES, UFS, type Cargo } from "@/config/site";
import { demoPermitido, getResultado } from "@/lib/tse/fetch";

// A CDN da Vercel guarda a resposta por 15s: milhares de visitantes = poucas chamadas ao TSE.
const CACHE = "public, max-age=10, s-maxage=15, stale-while-revalidate=60";

export async function GET(req: NextRequest, ctx: RouteContext<"/api/resultado/[cargo]/[uf]">) {
  const { cargo, uf } = await ctx.params;
  if (!(cargo in ELEICOES) || !(uf in UFS)) {
    return Response.json({ erro: "parâmetros inválidos" }, { status: 404 });
  }
  const turno = req.nextUrl.searchParams.get("turno") === "1" ? 1 : 2;
  const demo = demoPermitido(req.nextUrl.searchParams.get("demo"));
  try {
    const r = await getResultado(cargo as Cargo, uf, { turno, demo });
    return Response.json(r, { headers: { "Cache-Control": demo ? "no-store" : CACHE } });
  } catch (err) {
    console.error(err);
    return Response.json(
      { erro: "Não foi possível obter os dados do TSE agora." },
      { status: 502, headers: { "Cache-Control": "public, s-maxage=5" } },
    );
  }
}
