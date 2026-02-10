import type { Metadata } from "next";
import { Bangers, Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import SmartBanner from '@/components/SmartBanner';

// Configuración de fuentes
const bangers = Bangers({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-bangers"
});

const fredoka = Fredoka({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fredoka"
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Ofertitas – Demo MVP",
  description: "Las mejores ofertas de Tucumán.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${bangers.variable} ${fredoka.variable} ${nunito.variable}`}>
      <body className="font-nunito bg-cream text-text-dark min-h-screen">
        <StoreProvider>
          {children}
          <SmartBanner />
        </StoreProvider>
      </body>
    </html>
  );
}