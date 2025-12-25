import { useState } from 'react';
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
  AlertCircle 
} from 'lucide-react';
import { 
  getRealityRemaining, 
  canUseReality 
} from '@/lib/storage';

interface RealityTabProps {
  prompt: string;
}

const RealityTab = ({ prompt }: RealityTabProps) => {
  const { t, language } = useLanguage();
  const [isFetching, setIsFetching] = useState(false);
  const [marketData, setMarketData] = useState<{
    bullets: string[];
    sources: { title: string; url: string }[];
  } | null>(null);
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorData, setCompetitorData] = useState<{
    services?: string[];
    packages?: { name: string; price?: string }[];
    positioning?: string;
  } | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);
  
  const remaining = getRealityRemaining();
  const canFetch = canUseReality();

  const handleFetchReality = async () => {
    if (!canFetch || isFetching) return;
    
    setIsFetching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data (will be replaced with real API calls)
    setMarketData({
      bullets: language === 'ru' 
        ? [
            'Рынок клининга в Берлине растёт на 12% ежегодно',
            'Средний чек: €70-120 за визит',
            'WhatsApp — ключевой канал для бронирования',
            'Качество и пунктуальность — главные факторы выбора',
          ]
        : [
            'Berlin cleaning market growing 12% annually',
            'Average ticket: €70-120 per visit',
            'WhatsApp is the key booking channel',
            'Quality and punctuality are top decision factors',
          ],
      sources: [
        { title: 'Statista Market Report 2024', url: 'https://statista.com' },
        { title: 'Berlin Business Index', url: 'https://berlin.de/business' },
      ],
    });
    
    if (voiceEnabled) {
      setVoiceTranscript(
        language === 'ru'
          ? 'Краткий брифинг: рынок показывает устойчивый рост на 12% в год. Основные конкуренты фокусируются на качестве. Рекомендую WhatsApp для быстрого старта.'
          : 'Quick briefing: the market shows steady 12% annual growth. Main competitors focus on quality. I recommend WhatsApp for a quick start.'
      );
    }
    
    setIsFetching(false);
  };

  const handleScanCompetitor = async () => {
    if (!competitorUrl || !canFetch) return;
    
    setIsFetching(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock competitor data
    setCompetitorData({
      services: language === 'ru' 
        ? ['Уборка квартир', 'Генеральная уборка', 'Мытьё окон']
        : ['Apartment cleaning', 'Deep cleaning', 'Window washing'],
      packages: [
        { name: language === 'ru' ? 'Стандарт' : 'Standard', price: '€55' },
        { name: language === 'ru' ? 'Премиум' : 'Premium', price: '€95' },
      ],
      positioning: language === 'ru' 
        ? 'Фокус на экологичных средствах и гибком графике'
        : 'Focus on eco-friendly products and flexible scheduling',
    });
    
    setIsFetching(false);
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
              disabled={!canFetch || isFetching}
              size="sm"
              className="gap-2"
            >
              {isFetching ? (
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
      {marketData && (
        <div className="glass-card p-5 animate-fade-in">
          <h4 className="font-semibold text-foreground mb-4">
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
        </div>
      )}

      {/* Voice Briefing Transcript */}
      {voiceTranscript && (
        <div className="glass-card p-5 animate-fade-in border-primary/30">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-primary" />
            {t('reality.voice.title')}
          </h4>
          <p className="text-sm text-muted-foreground italic">
            "{voiceTranscript}"
          </p>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {language === 'ru' ? 'Аудио будет доступно при подключении ElevenLabs' : 'Audio available when ElevenLabs is connected'}
          </p>
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
            disabled={!competitorUrl || !canFetch || isFetching}
            variant="outline"
            size="sm"
          >
            {t('reality.competitor.scan')}
          </Button>
        </div>
        
        {!competitorUrl && !competitorData && (
          <p className="text-xs text-muted-foreground mt-2">
            {t('reality.competitor.skip')}
          </p>
        )}

        {competitorData && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
            <div className="grid gap-3 text-sm">
              {competitorData.services && (
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
              {competitorData.packages && (
                <div>
                  <span className="text-muted-foreground">{language === 'ru' ? 'Пакеты:' : 'Packages:'}</span>
                  <div className="mt-1 space-y-1">
                    {competitorData.packages.map((p, i) => (
                      <div key={i} className="flex justify-between text-foreground">
                        <span>{p.name}</span>
                        <span className="font-mono text-accent">{p.price}</span>
                      </div>
                    ))}
                  </div>
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
