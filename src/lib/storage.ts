"use client";

const QUEUE_KEY = "sf2026.queue.v1";

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
