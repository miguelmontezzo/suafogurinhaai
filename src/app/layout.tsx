import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sua Fogurinha AI — Mundial 2026",
  description: "Crie figurinhas personalizadas do álbum do Mundial 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-display">
        <header className="no-print sticky top-0 z-30 backdrop-blur bg-bg/70 border-b border-white/10">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <span className="text-gold text-xl">★</span>
              <span>Sua Fogurinha AI</span>
              <span className="text-white/40 text-xs ml-2">Mundial 2026</span>
            </Link>
            <nav className="flex gap-1 text-sm">
              <Link href="/generate" className="btn btn-ghost">Gerar</Link>
              <Link href="/queue" className="btn btn-ghost">Fila / Imprimir</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
        <footer className="no-print mx-auto max-w-6xl px-5 py-10 text-xs text-white/40">
          Powered by <code>gpt-image-2</code> · Renderiza figurinhas 2:3 (49×65mm) prontas para impressão A4.
        </footer>
      </body>
    </html>
  );
}
