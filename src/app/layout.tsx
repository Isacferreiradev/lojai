import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/shared/providers";
import { MetaPixel } from "@/components/meta-pixel";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Orna Casa | Decoração Premium e Design Autoral",
    template: "%s | Orna Casa"
  },
  description: "Encontre as melhores peças de decoração, iluminação, quadros e objetos para sua casa. Design premium com frete para todo o Brasil.",
  keywords: ["decoração", "iluminação", "quadros", "objetos decorativos", "casa"],
  authors: [{ name: "Orna Casa" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${bricolage.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <MetaPixel />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
