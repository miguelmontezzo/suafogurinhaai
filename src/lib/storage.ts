"use client";

const TEMPLATES_KEY = "sf2026.templates.v1";
const QUEUE_KEY = "sf2026.queue.v1";

export type TemplateRecord = {
  teamCode: string;
  teamName: string;
  imageDataUrl: string;
  updatedAt: number;
};

export type QueueItem = {
  id: string;
  imageDataUrl: string;
  label: string;
  teamCode: string;
  createdAt: number;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getTemplates(): TemplateRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse<TemplateRecord[]>(localStorage.getItem(TEMPLATES_KEY), []);
}

export function saveTemplate(rec: TemplateRecord) {
  const all = getTemplates().filter((t) => t.teamCode !== rec.teamCode);
  all.push(rec);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(all));
}

export function deleteTemplate(teamCode: string) {
  const all = getTemplates().filter((t) => t.teamCode !== teamCode);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(all));
}

export function getTemplate(teamCode: string): TemplateRecord | undefined {
  return getTemplates().find((t) => t.teamCode === teamCode);
}

export function getQueue(): QueueItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<QueueItem[]>(localStorage.getItem(QUEUE_KEY), []);
}

export function pushToQueue(items: QueueItem[]) {
  const all = [...getQueue(), ...items];
  localStorage.setItem(QUEUE_KEY, JSON.stringify(all));
}

export function clearQueue() {
  localStorage.setItem(QUEUE_KEY, JSON.stringify([]));
}

export function removeQueueItem(id: string) {
  const all = getQueue().filter((q) => q.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(all));
}
