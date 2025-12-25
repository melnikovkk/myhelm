// Demo-mode localStorage helpers for waitlist when backend is not configured

const WAITLIST_KEY = 'helm-waitlist-demo';
const REALITY_CACHE_KEY = 'helm-reality-cache';
const REALITY_COUNT_KEY = 'helm-reality-count';

export interface WaitlistEntry {
  id: string;
  email: string;
  prompt?: string;
  mode: 'new' | 'digitize';
  language: 'en' | 'ru';
  createdAt: string;
}

export interface RealityCacheEntry {
  promptHash: string;
  locale: string;
  mode: string;
  competitorUrl?: string;
  data: unknown;
  timestamp: number;
}

// Waitlist helpers
export function saveWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'createdAt'>): WaitlistEntry {
  const entries = getWaitlistEntries();
  const newEntry: WaitlistEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  entries.push(newEntry);
  localStorage.setItem(WAITLIST_KEY, JSON.stringify(entries));
  return newEntry;
}

export function getWaitlistEntries(): WaitlistEntry[] {
  try {
    const stored = localStorage.getItem(WAITLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function emailExists(email: string): boolean {
  const entries = getWaitlistEntries();
  return entries.some(e => e.email.toLowerCase() === email.toLowerCase());
}

// Reality cache helpers (24h TTL)
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function getCachedReality(
  prompt: string,
  locale: string,
  mode: string,
  competitorUrl?: string
): unknown | null {
  try {
    const stored = localStorage.getItem(REALITY_CACHE_KEY);
    if (!stored) return null;

    const cache: RealityCacheEntry[] = JSON.parse(stored);
    const promptHash = hashString(prompt);
    
    const entry = cache.find(
      e => e.promptHash === promptHash &&
           e.locale === locale &&
           e.mode === mode &&
           e.competitorUrl === competitorUrl
    );

    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }

    return null;
  } catch {
    return null;
  }
}

export function setCachedReality(
  prompt: string,
  locale: string,
  mode: string,
  data: unknown,
  competitorUrl?: string
): void {
  try {
    const stored = localStorage.getItem(REALITY_CACHE_KEY);
    let cache: RealityCacheEntry[] = stored ? JSON.parse(stored) : [];

    // Remove expired entries
    cache = cache.filter(e => Date.now() - e.timestamp < CACHE_TTL);

    const promptHash = hashString(prompt);
    
    // Remove existing entry for same params
    cache = cache.filter(
      e => !(e.promptHash === promptHash &&
             e.locale === locale &&
             e.mode === mode &&
             e.competitorUrl === competitorUrl)
    );

    cache.push({
      promptHash,
      locale,
      mode,
      competitorUrl,
      data,
      timestamp: Date.now(),
    });

    localStorage.setItem(REALITY_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore storage errors
  }
}

// Reality usage limit (2 per session)
const SESSION_LIMIT = 2;

export function getRealityUsageCount(): number {
  try {
    const stored = sessionStorage.getItem(REALITY_COUNT_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementRealityUsage(): number {
  const count = getRealityUsageCount() + 1;
  sessionStorage.setItem(REALITY_COUNT_KEY, count.toString());
  return count;
}

export function canUseReality(): boolean {
  return getRealityUsageCount() < SESSION_LIMIT;
}

export function getRealityRemaining(): number {
  return Math.max(0, SESSION_LIMIT - getRealityUsageCount());
}
