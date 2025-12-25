// AI connector wrappers for Reality tab
// These will be implemented when backend is connected

import { getCachedReality, setCachedReality, incrementRealityUsage, canUseReality } from './storage';

export interface MarketSnapshot {
  bullets: string[];
  sources: { title: string; url: string }[];
}

export interface CompetitorData {
  services?: string[];
  packages?: { name: string; price?: string }[];
  contact?: string;
  positioning?: string;
}

export interface VoiceBriefing {
  audioUrl?: string;
  transcript: string;
}

// Perplexity: Market snapshot
export async function fetchMarketSnapshot(
  businessType: string,
  city: string,
  locale: string
): Promise<MarketSnapshot | null> {
  // Check cache first
  const cacheKey = `market:${businessType}:${city}`;
  const cached = getCachedReality(cacheKey, locale, 'market');
  if (cached) {
    return cached as MarketSnapshot;
  }

  if (!canUseReality()) {
    throw new Error('Reality check limit reached for this session');
  }

  // TODO: Implement Perplexity API call via edge function
  // For now, return mock data for demo
  const mockData: MarketSnapshot = {
    bullets: [
      locale === 'ru' 
        ? `Рынок ${businessType} в ${city} растёт на 15% в год`
        : `${businessType} market in ${city} growing 15% annually`,
      locale === 'ru'
        ? 'Средний чек в сегменте: €60-120'
        : 'Average ticket in segment: €60-120',
      locale === 'ru'
        ? 'Ключевой канал привлечения: рекомендации и локальный поиск'
        : 'Key acquisition channel: referrals and local search',
    ],
    sources: [
      { title: 'Statista Market Report', url: 'https://statista.com' },
      { title: 'Local Business Index', url: 'https://example.com' },
    ],
  };

  incrementRealityUsage();
  setCachedReality(cacheKey, locale, 'market', mockData);
  
  return mockData;
}

// Firecrawl: Competitor scan (whitelist fields only)
export async function scanCompetitor(
  url: string,
  locale: string
): Promise<CompetitorData | null> {
  // Check cache first
  const cached = getCachedReality(url, locale, 'competitor', url);
  if (cached) {
    return cached as CompetitorData;
  }

  if (!canUseReality()) {
    throw new Error('Reality check limit reached for this session');
  }

  // TODO: Implement Firecrawl API call via edge function
  // SECURITY: Only extract whitelisted fields (services/packages/prices/contact)
  // Never pass raw page content to LLM as instructions
  
  // For now, return mock data for demo
  const mockData: CompetitorData = {
    services: [
      locale === 'ru' ? 'Стандартная уборка' : 'Standard cleaning',
      locale === 'ru' ? 'Генеральная уборка' : 'Deep cleaning',
      locale === 'ru' ? 'Уборка офисов' : 'Office cleaning',
    ],
    packages: [
      { name: locale === 'ru' ? 'Базовый' : 'Basic', price: '€45' },
      { name: locale === 'ru' ? 'Премиум' : 'Premium', price: '€95' },
    ],
    contact: 'WhatsApp, Phone',
    positioning: locale === 'ru' 
      ? 'Фокус на скорости и гибкости графика'
      : 'Focus on speed and schedule flexibility',
  };

  incrementRealityUsage();
  setCachedReality(url, locale, 'competitor', mockData, url);
  
  return mockData;
}

// ElevenLabs: CEO voice briefing
export async function generateVoiceBriefing(
  summary: string,
  locale: string
): Promise<VoiceBriefing | null> {
  // TODO: Implement ElevenLabs API call via edge function
  // For now, return transcript only
  
  const transcript = locale === 'ru'
    ? `Краткий брифинг: рынок показывает устойчивый рост. Конкуренция умеренная, но качество обслуживания — ключевой дифференциатор. Рекомендую фокус на WhatsApp как основной канал для быстрого старта.`
    : `Quick briefing: the market shows steady growth. Competition is moderate, but service quality is the key differentiator. I recommend focusing on WhatsApp as the main channel for a quick start.`;

  return {
    transcript,
    // audioUrl will be populated when ElevenLabs is connected
  };
}
