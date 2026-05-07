import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="card">
        <h1 className="text-3xl md:text-4xl font-bold">
          Crie sua figurinha do <span className="text-gold">Mundial 2026</span>
        </h1>
        <p className="text-white/70 mt-2 max-w-2xl">
          Selecione a seleção, tire uma foto, preencha os dados e a IA gera uma figurinha
          oficialesca em alta resolução. Depois é só escolher quantas cópias e a fila monta sozinha
          a folha A4 pronta para impressão.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/generate" className="btn btn-primary">Gerar figurinha</Link>
          <Link href="/templates" className="btn btn-ghost">Cadastrar modelos</Link>
          <Link href="/queue" className="btn btn-gold">Fila de impressão</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <Step n={1} title="Cadastrar modelo">
          Suba a figurinha base de cada seleção em <Link href="/templates" className="text-accent">Modelos</Link>.
          Ela vira a primeira imagem do prompt.
        </Step>
        <Step n={2} title="Tirar foto + preencher">
          Em <Link href="/generate" className="text-accent">Gerar</Link>: selecione a seleção, capture a foto,
          informe nome/dia/mês/ano/altura/peso/time/país.
        </Step>
        <Step n={3} title="Imprimir A4">
          Cada figurinha tem 49×65mm. A folha A4 comporta 16 figurinhas (4×4). A fila completa
          páginas inteiras automaticamente.
        </Step>
      </section>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="text-gold text-sm font-bold">PASSO {n}</div>
      <div className="text-lg font-semibold mt-1">{title}</div>
      <div className="text-sm text-white/70 mt-2">{children}</div>
    </div>
  );
}
