"use client";

import { clearQueue, getQueue, removeQueueItem, type QueueItem } from "@/lib/storage";
import { chunkPages, PER_SHEET } from "@/lib/sheet";
import { useEffect, useState } from "react";

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [zoom, setZoom] = useState<number>(0.45);

  function refresh() {
    setQueue(getQueue());
  }

  useEffect(() => {
    refresh();
  }, []);

  const pages = chunkPages(queue);
  const fullPages = Math.floor(queue.length / PER_SHEET);
  const remainder = queue.length % PER_SHEET;

  return (
    <div className="space-y-6">
      <header className="no-print">
        <h1 className="text-2xl font-bold">Fila de impressão</h1>
        <p className="text-white/70">
          {queue.length} figurinhas na fila · {fullPages} folha(s) A4 completa(s)
          {remainder > 0 && ` · +${remainder} sobrando (${PER_SHEET - remainder} para fechar a próxima folha)`}.
        </p>
        <p className="text-xs text-white/50 mt-1">
          Imprimimos somente folhas A4 inteiras. Cada folha leva exatamente 16 figurinhas (4×4).
        </p>
      </header>

      <div className="no-print card flex flex-wrap gap-2 items-center">
        <button className="btn btn-primary" onClick={() => window.print()} disabled={queue.length === 0}>
          🖨️ Imprimir / salvar PDF
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => {
            if (confirm("Limpar toda a fila?")) {
              clearQueue();
              refresh();
            }
          }}
          disabled={queue.length === 0}
        >
          Limpar fila
        </button>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-white/60">Zoom da prévia</span>
          <input
            type="range"
            min={0.25}
            max={1}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="card no-print text-white/70">
          A fila está vazia. Gere figurinhas em <a href="/generate" className="text-accent">Gerar</a> e adicione cópias à fila.
        </div>
      ) : (
        <>
          <div className="no-print card">
            <h2 className="font-semibold mb-3">Itens na fila</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-72 overflow-auto pr-1">
              {queue.map((q) => (
                <li key={q.id} className="rounded-lg bg-white/5 border border-white/10 p-1 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={q.imageDataUrl} alt={q.label} className="w-full aspect-[2/3] object-cover rounded" />
                  <span className="block text-[10px] text-white/70 truncate mt-1">{q.label}</span>
                  <button
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600/80 text-white text-xs rounded px-1"
                    onClick={() => {
                      removeQueueItem(q.id);
                      refresh();
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            {pages.map((page, idx) => (
              <div key={idx}>
                <p className="no-print text-xs text-white/60 mb-2">
                  Folha {idx + 1} de {pages.length} — {page.length}/{PER_SHEET}{" "}
                  {page.length < PER_SHEET ? "(parcial — gere mais figurinhas para fechar a folha)" : ""}
                </p>
                <div
                  className="origin-top-left"
                  style={{
                    transform: `scale(${zoom})`,
                    width: `calc(210mm * ${zoom})`,
                    height: `calc(297mm * ${zoom})`,
                  }}
                >
                  <div className="sheet">
                    {Array.from({ length: PER_SHEET }).map((_, i) => {
                      const item = page[i];
                      return (
                        <div key={i} className="slot">
                          {item && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.imageDataUrl} alt={item.label} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
