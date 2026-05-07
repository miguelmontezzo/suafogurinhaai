"use client";

import { TEAMS } from "@/lib/teams";
import { useMemo, useState } from "react";

export function TeamPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return TEAMS;
    return TEAMS.filter((t) => t.name.toLowerCase().includes(s) || t.code.toLowerCase().includes(s));
  }, [q]);

  return (
    <div>
      <label className="label">Seleção</label>
      <input
        className="input mb-3"
        placeholder="Buscar país..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-auto pr-1">
        {filtered.map((t) => {
          const active = value === t.code;
          return (
            <button
              key={t.code}
              type="button"
              onClick={() => onChange(t.code)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 border text-left text-sm transition ${
                active
                  ? "border-accent bg-accent/15"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <span className="text-xl leading-none">{t.flag}</span>
              <span className="truncate">{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
