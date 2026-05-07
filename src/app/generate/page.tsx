"use client";

import { CameraCapture } from "@/components/CameraCapture";
import { TeamPicker } from "@/components/TeamPicker";
import { findTeam } from "@/lib/teams";
import { pushToQueue, type QueueItem } from "@/lib/storage";
import type { StickerData } from "@/lib/prompt";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Step = "team" | "photo" | "data" | "result" | "copies";

type TemplateState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; url: string }
  | { status: "missing" }
  | { status: "fallback"; dataUrl: string };

export default function GeneratePage() {
  const [step, setStep] = useState<Step>("team");
  const [teamCode, setTeamCode] = useState<string>("BRA");
  const [photo, setPhoto] = useState<string | null>(null);
  const [tpl, setTpl] = useState<TemplateState>({ status: "idle" });

  const [form, setForm] = useState({
    nomePersonagem: "",
    dataNascimento: "",
    alturaMetros: "",
    pesoKg: "",
    nomeTime: "",
    paisDoTime: "",
  });

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copies, setCopies] = useState<number>(8);

  const team = useMemo(() => findTeam(teamCode), [teamCode]);

  useEffect(() => {
    let cancelled = false;
    setTpl({ status: "loading" });
    fetch(`/api/templates/${teamCode}`)
      .then((r) => r.json())
      .then((j: { exists: boolean; url?: string }) => {
        if (cancelled) return;
        if (j.exists && j.url) setTpl({ status: "found", url: j.url });
        else setTpl({ status: "missing" });
      })
      .catch(() => !cancelled && setTpl({ status: "missing" }));
    return () => {
      cancelled = true;
    };
  }, [teamCode]);

  function next(s: Step) {
    setError(null);
    setStep(s);
  }

  function onFallbackUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setTpl({ status: "fallback", dataUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  }

  async function generate() {
    setError(null);
    if (!team) return;
    if (tpl.status !== "found" && tpl.status !== "fallback") {
      setError("Modelo da seleção indisponível.");
      return;
    }
    if (!photo) {
      setError("Tire uma foto da pessoa antes.");
      return;
    }
    const required = [
      form.nomePersonagem,
      form.dataNascimento,
      form.alturaMetros,
      form.pesoKg,
      form.nomeTime,
      form.paisDoTime,
    ];
    if (required.some((v) => !v.trim())) {
      setError("Preencha todos os campos.");
      return;
    }

    const data: StickerData = {
      selecao: team.name,
      nomePersonagem: form.nomePersonagem.trim(),
      dataNascimento: form.dataNascimento.trim(),
      alturaMetros: form.alturaMetros.trim(),
      pesoKg: form.pesoKg.trim(),
      nomeTime: form.nomeTime.trim(),
      paisDoTime: form.paisDoTime.trim(),
    };

    setGenerating(true);
    try {
      const payload: Record<string, unknown> = { data, personImage: photo };
      if (tpl.status === "found") payload.templateTeamCode = team.code;
      else if (tpl.status === "fallback") payload.templateImage = tpl.dataUrl;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha na geração");
      setResult(json.imageDataUrl);
      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro");
    } finally {
      setGenerating(false);
    }
  }

  function addToPrintQueue() {
    if (!result || !team) return;
    const items: QueueItem[] = Array.from({ length: copies }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      imageDataUrl: result,
      label: `${form.nomePersonagem} • ${team.name}`,
      teamCode: team.code,
      createdAt: Date.now(),
    }));
    pushToQueue(items);
  }

  const canContinueFromTeam = tpl.status === "found" || tpl.status === "fallback";

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerar figurinha</h1>
        <Stepper current={step} />
      </header>

      {step === "team" && (
        <div className="card space-y-4">
          <TeamPicker value={teamCode} onChange={setTeamCode} />

          <TemplateStatus team={team?.name || ""} code={teamCode} state={tpl} onUpload={onFallbackUpload} />

          <div className="flex justify-end">
            <button
              className="btn btn-primary"
              onClick={() => next("photo")}
              disabled={!canContinueFromTeam}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === "photo" && (
        <div className="card space-y-4">
          <CameraCapture value={photo} onChange={setPhoto} />
          <div className="flex justify-between">
            <button className="btn btn-ghost" onClick={() => next("team")}>Voltar</button>
            <button className="btn btn-primary" onClick={() => next("data")} disabled={!photo}>
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === "data" && (
        <div className="card space-y-3">
          <Field label="Nome do personagem" v={form.nomePersonagem} on={(v) => setForm({ ...form, nomePersonagem: v })} placeholder="Ex.: João Silva" />
          <div className="grid grid-cols-3 gap-3">
            <Field label="Nascimento (DIA/MÊS/ANO)" v={form.dataNascimento} on={(v) => setForm({ ...form, dataNascimento: v })} placeholder="14/05/1990" />
            <Field label="Altura (m)" v={form.alturaMetros} on={(v) => setForm({ ...form, alturaMetros: v })} placeholder="1.78" />
            <Field label="Peso (kg)" v={form.pesoKg} on={(v) => setForm({ ...form, pesoKg: v })} placeholder="76" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome do time" v={form.nomeTime} on={(v) => setForm({ ...form, nomeTime: v })} placeholder="Ex.: Palmeiras" />
            <Field label="País do time" v={form.paisDoTime} on={(v) => setForm({ ...form, paisDoTime: v })} placeholder="Ex.: Brasil" />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex justify-between">
            <button className="btn btn-ghost" onClick={() => next("photo")}>Voltar</button>
            <button className="btn btn-primary" onClick={generate} disabled={generating}>
              {generating ? "Gerando..." : "✨ Gerar figurinha"}
            </button>
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Sua figurinha</h2>
          <div className="grid md:grid-cols-2 gap-5 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result} alt="figurinha" className="w-full max-w-sm mx-auto rounded-xl bg-black/30" />
            <div className="space-y-3">
              <p className="text-sm text-white/70">
                Imagem gerada em 1024×1536 (2:3) — alta resolução para impressão em 49×65mm.
              </p>
              <a download={`figurinha-${form.nomePersonagem || "nova"}.png`} href={result} className="btn btn-ghost">
                ⬇ Baixar PNG
              </a>
              <div>
                <label className="label">Quantas cópias adicionar à fila?</label>
                <input
                  type="number"
                  min={1}
                  max={64}
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, Math.min(64, Number(e.target.value) || 1)))}
                  className="input max-w-32"
                />
                <p className="text-xs text-white/50 mt-1">A folha A4 cabe 16 figurinhas (4×4).</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="btn btn-gold"
                  onClick={() => {
                    addToPrintQueue();
                    setStep("copies");
                  }}
                >
                  Adicionar {copies} à fila de impressão
                </button>
                <button className="btn btn-ghost" onClick={() => { setResult(null); setStep("team"); }}>
                  Gerar outra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "copies" && (
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Adicionado à fila ✅</h2>
          <p className="text-white/70">
            {copies} cópias de <strong>{form.nomePersonagem}</strong> ({team?.name}) foram inseridas na fila de impressão.
          </p>
          <div className="flex gap-2">
            <Link href="/queue" className="btn btn-primary">Ver fila / imprimir</Link>
            <button className="btn btn-ghost" onClick={() => { setResult(null); setStep("team"); }}>
              Gerar outra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateStatus({
  team, code, state, onUpload,
}: {
  team: string;
  code: string;
  state: TemplateState;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  if (state.status === "loading" || state.status === "idle") {
    return <p className="text-sm text-white/60">Verificando modelo de {team}...</p>;
  }
  if (state.status === "found") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={state.url} alt={team} className="h-24 aspect-[2/3] object-cover rounded" />
        <div className="text-sm">
          <div className="text-emerald-300 font-semibold">Modelo de {team} carregado</div>
          <div className="text-white/60">Será usado automaticamente como referência da figurinha.</div>
          <code className="text-xs text-white/40">{state.url}</code>
        </div>
      </div>
    );
  }
  if (state.status === "fallback") {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-amber-500/10 border border-amber-400/20 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={state.dataUrl} alt="modelo temporário" className="h-24 aspect-[2/3] object-cover rounded" />
        <div className="text-sm">
          <div className="text-amber-300 font-semibold">Modelo temporário (apenas esta sessão)</div>
          <div className="text-white/70">
            Para tornar permanente, salve como <code>public/templates/{code}.png</code> e faça commit no repositório.
          </div>
        </div>
      </div>
    );
  }
  // missing
  return (
    <div className="rounded-xl bg-amber-500/10 border border-amber-400/20 p-3 space-y-2">
      <p className="text-amber-300 font-semibold">Sem modelo cadastrado para {team}.</p>
      <p className="text-sm text-white/70">
        Salve a figurinha base como <code>public/templates/{code}.png</code> no repositório e faça push —
        o Vercel atualiza no próximo deploy.
      </p>
      <label className="btn btn-ghost cursor-pointer w-fit">
        Usar modelo temporário (esta sessão)
        <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
      </label>
    </div>
  );
}

function Field({
  label, v, on, placeholder,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={v} onChange={(e) => on(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Stepper({ current }: { current: Step }) {
  const steps: { k: Step; label: string }[] = [
    { k: "team", label: "Seleção" },
    { k: "photo", label: "Foto" },
    { k: "data", label: "Dados" },
    { k: "result", label: "Figurinha" },
    { k: "copies", label: "Fila" },
  ];
  return (
    <ol className="hidden md:flex gap-1 text-xs">
      {steps.map((s, i) => (
        <li
          key={s.k}
          className={`px-2 py-1 rounded-md border ${
            current === s.k ? "border-accent text-accent" : "border-white/10 text-white/60"
          }`}
        >
          {i + 1}. {s.label}
        </li>
      ))}
    </ol>
  );
}
