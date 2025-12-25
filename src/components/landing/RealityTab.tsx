import { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  Search, 
  Loader2, 
  ExternalLink, 
  Volume2, 
  AlertCircle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  getRealityRemaining, 
  canUseReality,
  incrementRealityUsage,
  getCachedReality,
  setCachedReality
} from '@/lib/storage';

interface RealityTabProps {
  prompt: string;
}

interface MarketData {
  bullets: string[];
  sources: { title: string; url: string }[];
}

interface CompetitorData {
  services?: string[];
  packages?: { name: string; price?: string }[];
  contact?: string;
  positioning?: string;
}

const RealityTab = ({ prompt }: RealityTabProps) => {
  const { t, language } = useLanguage();
  const [isFetchingMarket, setIsFetchingMarket] = useState(false);
  const [isFetchingCompetitor, setIsFetchingCompetitor] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketError, setMarketError] = useState<string | null>(null);
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);
  const [competitorError, setCompetitorError] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const remaining = getRealityRemaining();
  const canFetch = canUseReality();

  // Extract business type and city from prompt
  const extractBusinessInfo = () => {
    const words = prompt.toLowerCase();
    let businessType = 'cleaning';
    let city = 'Berlin';
    
    if (words.includes('клининг') || words.includes('уборк') || words.includes('cleaning')) {
      businessType = language === 'ru' ? 'клининг' : 'cleaning';
    } else if (words.includes('консалтинг') || words.includes('consulting')) {
      businessType = language === 'ru' ? 'консалтинг' : 'consulting';
    }
    
    if (words.includes('берлин') || words.includes('berlin')) {
      city = language === 'ru' ? 'Берлин' : 'Berlin';
    } else if (words.includes('москв') || words.includes('moscow')) {
      city = language === 'ru' ? 'Москва' : 'Moscow';
    }
    
    return { businessType, city };
  };

  const handleFetchReality = async () => {
    if (!canFetch || isFetchingMarket) return;
    
    // Check cache first
    const cacheKey = `market:${prompt}`;
    const cached = getCachedReality(cacheKey, language, 'market');
    if (cached) {
      setMarketData(cached as MarketData);
      return;
    }
    
    setIsFetchingMarket(true);
    setMarketError(null);
    
    try {
      const { businessType, city } = extractBusinessInfo();
      
      const { data, error } = await supabase.functions.invoke('market-snapshot', {
        body: { businessType, city, locale: language },
      });
      
      if (error) throw error;
      
      if (data.success && data.data) {
        setMarketData(data.data);
        incrementRealityUsage();
        setCachedReality(cacheKey, language, 'market', data.data);
        
        // Generate voice briefing if enabled
        if (voiceEnabled && data.data.bullets.length > 0) {
          await generateVoiceBriefing(data.data.bullets);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch market data');
      }
    } catch (error) {
      console.error('Market snapshot error:', error);
      setMarketError(
        language === 'ru' 
          ? 'Не удалось загрузить данные о рынке' 
          : 'Failed to fetch market data'
      );
    } finally {
      setIsFetchingMarket(false);
    }
  };

  const generateVoiceBriefing = async (bullets: string[]) => {
    setIsGeneratingVoice(true);
    
    try {
      // Create summary for voice briefing
      const summary = bullets.slice(0, 3).join('. ');
      const briefingText = language === 'ru'
        ? `Краткий брифинг по вашему рынку. ${summary}. Рекомендую начать с анализа конкурентов и определения своего уникального предложения.`
        : `Quick market briefing. ${summary}. I recommend starting with competitor analysis and defining your unique value proposition.`;
      
      setVoiceTranscript(briefingText);
      
      const { data, error } = await supabase.functions.invoke('ceo-voice-briefing', {
        body: { text: briefingText, locale: language },
      });
      
      if (error) throw error;
      
      if (data.audioContent) {
        // Create audio URL from base64
        const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
        setVoiceAudioUrl(audioUrl);
        
        // Create audio element
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => setIsPlayingVoice(false);
        audio.onerror = () => {
          console.error('Audio playback error');
          setIsPlayingVoice(false);
        };
      }
    } catch (error) {
      console.error('Voice briefing error:', error);
      // Don't show error to user, just keep transcript visible
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const toggleVoicePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlayingVoice) {
      audioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      audioRef.current.play();
      setIsPlayingVoice(true);
    }
  };

  const handleScanCompetitor = async () => {
    if (!competitorUrl || !canFetch || isFetchingCompetitor) return;
    
    // Check cache
    const cached = getCachedReality(competitorUrl, language, 'competitor', competitorUrl);
    if (cached) {
      setCompetitorData(cached as CompetitorData);
      return;
    }
    
    setIsFetchingCompetitor(true);
    setCompetitorError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('competitor-scan', {
        body: { url: competitorUrl, locale: language },
      });
      
      if (error) throw error;
      
      if (data.success && data.data) {
        setCompetitorData(data.data);
        incrementRealityUsage();
        setCachedReality(competitorUrl, language, 'competitor', data.data, competitorUrl);
      } else {
        throw new Error(data.error || 'Failed to scan competitor');
      }
    } catch (error) {
      console.error('Competitor scan error:', error);
      setCompetitorError(
        language === 'ru' 
          ? 'Не удалось просканировать сайт конкурента' 
          : 'Failed to scan competitor website'
      );
    } finally {
      setIsFetchingCompetitor(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Fetch Reality Button */}
      <div className="glass-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              {t('reality.title')}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {t('reality.note')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {t('reality.limit')}: <span className="font-mono text-primary">{remaining}</span>
            </span>
            <Button
              onClick={handleFetchReality}
              disabled={!canFetch || isFetchingMarket}
              size="sm"
              className="gap-2"
            >
              {isFetchingMarket ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('reality.fetching')}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  {t('reality.fetch')}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Voice toggle */}
        <div className="flex items-center gap-3 pt-3 border-t border-border/50">
          <Switch
            id="voice-toggle"
            checked={voiceEnabled}
            onCheckedChange={setVoiceEnabled}
          />
          <Label htmlFor="voice-toggle" className="text-sm text-muted-foreground flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            {t('reality.voice.toggle')}
          </Label>
        </div>
      </div>

      {/* Market Snapshot */}
      {marketError && (
        <div className="glass-card p-5 border-destructive/50 animate-fade-in">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{marketError}</span>
          </div>
        </div>
      )}
      
      {marketData && (
        <div className="glass-card p-5 animate-fade-in">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            {t('reality.market.title')}
          </h4>
          <ul className="space-y-2 mb-4">
            {marketData.bullets.map((bullet, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {bullet}
              </li>
            ))}
          </ul>
          {marketData.sources.length > 0 && (
            <div className="pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground">{t('reality.market.sources')}:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {marketData.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    {source.title}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Voice Briefing */}
      {(voiceTranscript || isGeneratingVoice) && (
        <div className="glass-card p-5 animate-fade-in border-primary/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-primary" />
              {t('reality.voice.title')}
            </h4>
            
            {voiceAudioUrl && (
              <Button
                onClick={toggleVoicePlayback}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {isPlayingVoice ? (
                  <>
                    <Pause className="w-4 h-4" />
                    {language === 'ru' ? 'Пауза' : 'Pause'}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {language === 'ru' ? 'Слушать' : 'Play'}
                  </>
                )}
              </Button>
            )}
          </div>
          
          {isGeneratingVoice ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">
                {language === 'ru' ? 'Генерация голосового брифинга...' : 'Generating voice briefing...'}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              "{voiceTranscript}"
            </p>
          )}
        </div>
      )}

      {/* Competitor Scan */}
      <div className="glass-card p-5">
        <h4 className="font-semibold text-foreground mb-4">
          {t('reality.competitor.title')}
        </h4>
        <div className="flex gap-2">
          <Input
            type="url"
            value={competitorUrl}
            onChange={(e) => setCompetitorUrl(e.target.value)}
            placeholder={t('reality.competitor.placeholder')}
            className="flex-1"
          />
          <Button
            onClick={handleScanCompetitor}
            disabled={!competitorUrl || !canFetch || isFetchingCompetitor}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {isFetchingCompetitor ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              t('reality.competitor.scan')
            )}
          </Button>
        </div>
        
        {!competitorUrl && !competitorData && (
          <p className="text-xs text-muted-foreground mt-2">
            {t('reality.competitor.skip')}
          </p>
        )}

        {competitorError && (
          <div className="mt-4 flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            {competitorError}
          </div>
        )}

        {competitorData && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
            <div className="grid gap-3 text-sm">
              {competitorData.services && competitorData.services.length > 0 && (
                <div>
                  <span className="text-muted-foreground">{language === 'ru' ? 'Услуги:' : 'Services:'}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {competitorData.services.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-secondary rounded text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {competitorData.packages && competitorData.packages.length > 0 && (
                <div>
                  <span className="text-muted-foreground">{language === 'ru' ? 'Пакеты:' : 'Packages:'}</span>
                  <div className="mt-1 space-y-1">
                    {competitorData.packages.map((p, i) => (
                      <div key={i} className="flex justify-between text-foreground">
                        <span>{p.name}</span>
                        {p.price && <span className="font-mono text-accent">{p.price}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {competitorData.contact && (
                <div>
                  <span className="text-muted-foreground">{language === 'ru' ? 'Контакты:' : 'Contact:'}</span>
                  <p className="text-foreground mt-1">{competitorData.contact}</p>
                </div>
              )}
              {competitorData.positioning && (
                <div>
                  <span className="text-muted-foreground">{language === 'ru' ? 'Позиционирование:' : 'Positioning:'}</span>
                  <p className="text-foreground mt-1">{competitorData.positioning}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealityTab;
