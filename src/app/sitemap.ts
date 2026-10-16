import type { MetadataRoute } from "next";
import { SITE, UFS_GOVERNADOR_2T } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = ["", "/como-funciona", "/sobre", "/privacidade", ...UFS_GOVERNADOR_2T.map((uf) => `/governador/${uf}`)];
  return paginas.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "always", priority: p === "" ? 1 : 0.7 }));
}
