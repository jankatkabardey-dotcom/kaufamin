import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaufamin — Einkaufen ohne Reue",
  description: "Stressfrei shoppen, bestellen und entspannen — ohne echten Kauf. Dein Dopamin-Erlebnis für entspannte Momente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      <body className={`${inter.className} min-h-full bg-[#0a0f1e] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
