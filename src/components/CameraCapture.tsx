"use client";

import { useEffect, useRef, useState } from "react";

export function CameraCapture({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1440 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Não foi possível acessar a câmera";
      setError(msg);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  }

  function snapshot() {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    onChange(canvas.toDataURL("image/png"));
    stopCamera();
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <label className="label">Foto da pessoa</label>

      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Foto" className="w-full max-h-80 object-contain rounded-xl bg-black/30" />
          <div className="mt-2 flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => onChange(null)}>
              Tirar outra
            </button>
          </div>
        </div>
      ) : active ? (
        <div className="relative">
          <video ref={videoRef} className="w-full rounded-xl bg-black/40 max-h-80 object-contain" muted playsInline />
          <div className="mt-2 flex gap-2">
            <button type="button" className="btn btn-primary" onClick={snapshot}>📸 Capturar</button>
            <button type="button" className="btn btn-ghost" onClick={stopCamera}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <button type="button" className="btn btn-primary" onClick={startCamera}>
            Abrir câmera
          </button>
          <label className="btn btn-ghost cursor-pointer">
            Ou enviar arquivo
            <input type="file" accept="image/*" capture="user" className="hidden" onChange={onUpload} />
          </label>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      )}
    </div>
  );
}
