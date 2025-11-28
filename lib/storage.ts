import { StreamerInput } from './types';

const STORAGE_KEY = 'live-stream-unite-streamers';

export function getStoredStreamers(): StreamerInput[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveStreamers(streamers: StreamerInput[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(streamers));
}
