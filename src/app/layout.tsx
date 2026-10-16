import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ADSENSE_CLIENT, SITE } from "@/config/site";
import { Cabecalho, Rodape } from "@/components/estrutura";
import { BannerConsentimento } from "@/components/consentimento";
import { AvisoSimulacao } from "@/components/aviso-simulacao";
import { MenuInferior } from "@/components/celular";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nome}: 2º turno das Eleições 2026 em tempo real`,
    template: `%s | ${SITE.nome}`,
  },
  description: SITE.descricao,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
    title: "Apuração do 2º turno ao vivo",
    description: "Presidente e governadores, atualizado a cada 30 segundos com dados oficiais do TSE.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b0f2e" },
    { media: "(prefers-color-scheme: dark)", color: "#050720" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AvisoSimulacao />
        <Cabecalho />
        <main className="mx-auto w-full max-w-5xl flex-1 px-3 py-5 sm:px-4 sm:py-8">{children}</main>
        <Rodape />
        <MenuInferior />
        <BannerConsentimento />
        {ADSENSE_CLIENT && (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
      </body>
    </html>
  );
}
