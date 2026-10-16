import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site 100% estático (pasta "out"), hospedado na Cloudflare.
  // Os resultados são buscados pelo navegador direto nos arquivos públicos do TSE.
  output: "export",
  trailingSlash: true,
  images: {
    // Sem servidor de otimização: as fotos vêm direto do TSE.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
