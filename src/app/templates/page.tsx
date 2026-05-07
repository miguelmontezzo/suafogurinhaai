"use client";

import { TeamPicker } from "@/components/TeamPicker";
import { findTeam, TEAMS } from "@/lib/teams";
import {
  deleteTemplate,
  getTemplates,
  saveTemplate,
  type TemplateRecord,
} from "@/lib/storage";
import { useEffect, useState } from "react";

export default function TemplatesPage() {
  const [team, setTeam] = useState<string>("BRA");
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  function refresh() {
    setTemplates(getTemplates());
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError("Imagem maior que 8MB. Comprima antes de enviar.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function onSave() {
    if (!preview) {
      setError("Selecione uma imagem primeiro.");
      return;
    }
    const t = findTeam(team);
    if (!t) return;
    saveTemplate({
      teamCode: t.code,
      teamName: t.name,
      imageDataUrl: preview,
      updatedAt: Date.now(),
    });
    setPreview(null);
    refresh();
  }

  function onDelete(code: string) {
    if (!confirm("Remover modelo desta seleção?")) return;
    deleteTemplate(code);
    refresh();
  }

  const registered = templates.length;
  const total = TEAMS.length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Cadastro de modelos</h1>
        <p className="text-white/70">
          Suba a figurinha base de cada seleção. Essa imagem será usada como{" "}
          <em>primeira imagem</em> do prompt na hora de gerar.
        </p>
        <p className="text-xs text-white/50 mt-1">
          {registered} de {total} seleções com modelo cadastrado.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <TeamPicker value={team} onChange={setTeam} />

          <div>
            <label className="label">Imagem da figurinha base (PNG/JPG)</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={onUpload}
              className="input"
            />
          </div>

          {preview && (
            <div className="rounded-xl bg-black/30 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="preview" className="max-h-80 mx-auto" />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={onSave} disabled={!preview}>
              Salvar modelo de {findTeam(team)?.name}
            </button>
            <button className="btn btn-ghost" onClick={() => setPreview(null)} disabled={!preview}>
              Limpar
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-3">Modelos cadastrados</h2>
          {templates.length === 0 ? (
            <p className="text-white/60 text-sm">Nenhum modelo cadastrado ainda.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3">
              {templates.map((t) => (
                <li key={t.teamCode} className="rounded-xl bg-white/5 border border-white/10 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.imageDataUrl}
                    alt={t.teamName}
                    className="w-full aspect-[2/3] object-cover rounded-lg bg-black/40"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="font-medium truncate">{t.teamName}</span>
                    <button
                      className="text-red-300 hover:text-red-200"
                      onClick={() => onDelete(t.teamCode)}
                    >
                      remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
