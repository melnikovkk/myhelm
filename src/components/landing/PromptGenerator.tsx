import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Sparkles, 
  Loader2, 
  Building2, 
  ShoppingCart, 
  User, 
  HelpCircle,
  Rocket,
  RefreshCw,
  MapPin,
  Pencil,
  Globe,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { RegionConfig, IndustryConfig } from '@/lib/regionData';

type Mode = 'zero' | 'digitize' | null;
type BusinessType = 'service' | 'ecommerce' | 'creator' | 'other' | null;
type Step = 'mode' | 'business' | 'digitize_details' | 'location' | 'generating' | 'ready';

interface MarketSnapshot {
  bullets: string[];
  sources: { title: string; url: string }[];
}

interface PromptGeneratorProps {
  onPromptGenerated: (prompt: string, marketData?: MarketSnapshot) => void;
  onUseCanon: () => void;
  region?: RegionConfig | null;
  industry?: IndustryConfig | null;
}

const BUSINESS_TYPES = [
  { key: 'service', icon: Building2, labelEn: 'Service', labelRu: 'Услуги', color: 'text-primary' },
  { key: 'ecommerce', icon: ShoppingCart, labelEn: 'E-commerce', labelRu: 'E-commerce', color: 'text-accent' },
  { key: 'creator', icon: User, labelEn: 'Creator', labelRu: 'Автор/Блогер', color: 'text-success' },
  { key: 'other', icon: HelpCircle, labelEn: 'Other', labelRu: 'Другое', color: 'text-muted-foreground' },
] as const;

const PromptGenerator = ({ onPromptGenerated, onUseCanon, region, industry }: PromptGeneratorProps) => {
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>('mode');
  const [mode, setMode] = useState<Mode>(null);
  const [businessType, setBusinessType] = useState<BusinessType>(null);
  const [location, setLocation] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Digitize-specific fields
  const [existingBusinessName, setExistingBusinessName] = useState('');
  const [painPoints, setPainPoints] = useState('');
  
  // Reality fetch state
  const [isFetchingReality, setIsFetchingReality] = useState(false);
  const [marketData, setMarketData] = useState<MarketSnapshot | null>(null);
  const [realityFetched, setRealityFetched] = useState(false);

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode);
    if (selectedMode === 'digitize') {
      setStep('digitize_details');
    } else {
      setStep('business');
    }
  };

  const handleBusinessSelect = async (type: BusinessType) => {
    setBusinessType(type);
    
    // For 'other' or if we need location, ask for it
    if (type === 'other' || type === 'service') {
      setStep('location');
    } else {
      // Generate directly
      await generatePrompt(type, '');
    }
  };

  const handleLocationSubmit = async () => {
    await generatePrompt(businessType, location);
  };

  const handleDigitizeSubmit = async () => {
    await generatePrompt(businessType, location);
  };

  const generatePrompt = async (type: BusinessType, loc: string) => {
    setStep('generating');
    setIsGenerating(true);
    setError(null);

    try {
      // Use region/industry from props if available
      const regionCode = region?.code || 'US';
      const regionName = region ? (language === 'ru' ? region.nameRu : region.nameEn) : '';
      const currency = region?.currency || 'USD';
      const industryKey = industry?.key || type || 'service';
      const industryName = industry ? (language === 'ru' ? industry.labelRu : industry.labelEn) : '';

      const { data, error: fnError } = await supabase.functions.invoke('generate-demo-prompt', {
        body: {
          mode,
          businessType: type || industryKey,
          location: loc || regionName,
          locale: language,
          // Enhanced context from selectors
          regionCode,
          currency,
          industryKey,
          industryName,
          // Digitize-specific context
          existingBusinessName: mode === 'digitize' ? existingBusinessName : undefined,
          painPoints: mode === 'digitize' ? painPoints : undefined,
        },
      });

      if (fnError) throw fnError;

      if (data?.prompt) {
        setGeneratedPrompt(data.prompt);
        setStep('ready');
      } else {
        throw new Error('No prompt generated');
      }
    } catch (err) {
      console.error('Prompt generation error:', err);
      setError(language === 'ru' 
        ? 'Не удалось сгенерировать промпт. Попробуйте пример.' 
        : 'Failed to generate prompt. Try the example.');
      setStep('mode'); // Reset to start
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchReality = async () => {
    setIsFetchingReality(true);
    setError(null);

    try {
      // Extract business type and location from prompt for Perplexity query
      const businessTypeLabel = BUSINESS_TYPES.find(b => b.key === businessType)?.labelEn || 'business';
      const city = location || 'global market';

      const { data, error: fnError } = await supabase.functions.invoke('market-snapshot', {
        body: {
          businessType: businessTypeLabel,
          city,
          locale: language,
        },
      });

      if (fnError) throw fnError;

      if (data?.success && data?.data) {
        setMarketData(data.data);
        setRealityFetched(true);
      } else {
        throw new Error(data?.error || 'Failed to fetch market data');
      }
    } catch (err) {
      console.error('Reality fetch error:', err);
      setError(language === 'ru' 
        ? 'Не удалось загрузить данные рынка' 
        : 'Failed to fetch market data');
    } finally {
      setIsFetchingReality(false);
    }
  };

  const handleConfirmPrompt = () => {
    onPromptGenerated(generatedPrompt, marketData || undefined);
  };

  const handleRegenerate = async () => {
    setMarketData(null);
    setRealityFetched(false);
    await generatePrompt(businessType, location);
  };

  const handleReset = () => {
    setStep('mode');
    setMode(null);
    setBusinessType(null);
    setLocation('');
    setGeneratedPrompt('');
    setError(null);
    setMarketData(null);
    setRealityFetched(false);
    setExistingBusinessName('');
    setPainPoints('');
  };

  // Progress indicator
  const getProgress = () => {
    switch (step) {
      case 'mode': return 1;
      case 'business': return 2;
      case 'digitize_details': return 2;
      case 'location': return 3;
      case 'generating': return 3.5;
      case 'ready': return 4;
      default: return 1;
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((dot) => (
          <div
            key={dot}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              getProgress() >= dot 
                ? 'bg-primary scale-100' 
                : 'bg-border scale-75'
            } ${getProgress() === dot ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background' : ''}`}
          />
        ))}
      </div>

      {/* Step 1: Mode Selection */}
      {step === 'mode' && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-sm text-muted-foreground text-center">
            {language === 'ru' ? 'Выберите сценарий запуска:' : 'Choose your launch scenario:'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              className="group relative h-auto py-5 px-4 flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              onClick={() => handleModeSelect('zero')}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {language === 'ru' ? 'Начать с нуля' : 'Start from zero'}
              </span>
              <span className="text-xs text-muted-foreground">
                {language === 'ru' ? 'Новый бизнес' : 'New venture'}
              </span>
            </button>
            <button
              className="group relative h-auto py-5 px-4 flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
              onClick={() => handleModeSelect('digitize')}
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6 text-accent" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {language === 'ru' ? 'Оцифровать' : 'Digitize existing'}
              </span>
              <span className="text-xs text-muted-foreground">
                {language === 'ru' ? 'Уже работает' : 'Already running'}
              </span>
            </button>
          </div>
          
          {error && (
            <p className="text-xs text-destructive text-center bg-destructive/10 py-2 px-3 rounded-lg">{error}</p>
          )}
          
          <div className="relative flex items-center justify-center mt-6">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border/50" />
            <span className="relative px-3 text-xs text-muted-foreground bg-card">
              {language === 'ru' ? 'или' : 'or'}
            </span>
          </div>
          
          <button 
            onClick={onUseCanon}
            className="w-full py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 hover:border-primary/30 hover:bg-primary/5"
          >
            <Sparkles className="w-4 h-4" />
            {language === 'ru' ? 'Использовать готовый пример' : 'Use demo example'}
          </button>
        </div>
      )}

      {/* Step 2: Business Type */}
      {step === 'business' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Тип бизнеса:' : 'Business type:'}
            </p>
            <button 
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              ← {language === 'ru' ? 'Назад' : 'Back'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BUSINESS_TYPES.map(({ key, icon: Icon, labelEn, labelRu, color }) => (
              <button
                key={key}
                className="group h-auto py-4 px-3 flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                onClick={() => handleBusinessSelect(key as BusinessType)}
              >
                <div className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {language === 'ru' ? labelRu : labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2b: Digitize Details (for existing business) */}
      {step === 'digitize_details' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Расскажи о своём бизнесе:' : 'Tell us about your business:'}
            </p>
            <button 
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              ← {language === 'ru' ? 'Назад' : 'Back'}
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {language === 'ru' ? 'Название / тип бизнеса' : 'Business name / type'}
              </label>
              <input
                type="text"
                value={existingBusinessName}
                onChange={(e) => setExistingBusinessName(e.target.value)}
                placeholder={language === 'ru' ? 'Например: Автомастерская "Мотор"' : 'e.g., "Motor" Auto Repair Shop'}
                className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {language === 'ru' ? 'Что хочешь улучшить?' : 'What do you want to improve?'}
              </label>
              <textarea
                value={painPoints}
                onChange={(e) => setPainPoints(e.target.value)}
                placeholder={language === 'ru' 
                  ? 'Например: учёт клиентов в блокноте, забываю перезванивать, нет онлайн-записи...' 
                  : 'e.g., tracking clients in a notebook, forgetting callbacks, no online booking...'}
                className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-muted-foreground/50 min-h-[80px] resize-none"
              />
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {language === 'ru' ? 'Город (опционально)' : 'City (optional)'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={language === 'ru' ? 'Например: Москва' : 'e.g., Berlin'}
                className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
          
          <Button
            className="w-full gap-2 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleDigitizeSubmit}
            disabled={!existingBusinessName.trim()}
          >
            <Sparkles className="w-4 h-4" />
            {language === 'ru' ? 'Создать Business Program' : 'Create Business Program'}
          </Button>
        </div>
      )}

      {/* Step 3: Location (optional) */}
      {step === 'location' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {language === 'ru' ? 'Город или страна:' : 'City or country:'}
            </p>
            <button 
              onClick={() => setStep('business')}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              ← {language === 'ru' ? 'Назад' : 'Back'}
            </button>
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={language === 'ru' ? 'Например: Берлин, Москва, NYC' : 'e.g., Berlin, Moscow, NYC'}
            className="w-full px-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
            autoFocus
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => generatePrompt(businessType, '')}
            >
              {language === 'ru' ? 'Пропустить' : 'Skip'}
            </Button>
            <Button
              className="flex-1 gap-2 rounded-xl bg-primary hover:bg-primary/90"
              onClick={handleLocationSubmit}
              disabled={!location.trim()}
            >
              <Sparkles className="w-4 h-4" />
              {language === 'ru' ? 'Далее' : 'Next'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Generating */}
      {step === 'generating' && (
        <div className="space-y-4 animate-fade-in">
          {/* Skeleton structure mimicking ready state */}
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-secondary/60 to-secondary/30 rounded-xl border border-border/30">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
          
          {/* Loading indicator */}
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Создаём идеальный промпт...' : 'Crafting your perfect prompt...'}
            </p>
          </div>
          
          {/* Skeleton buttons */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-9 flex-1 rounded-lg" />
          </div>
        </div>
      )}

      {/* Step 5: Ready - Show generated prompt */}
      {step === 'ready' && (
        <div className="space-y-4 animate-fade-in">
          {/* Generated prompt display */}
          <div className="relative group">
            <div className="p-4 bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl border border-border/50 group-hover:border-primary/30 transition-colors">
              <p className="text-sm text-foreground leading-relaxed pr-8">
                {generatedPrompt}
              </p>
            </div>
            <button
              onClick={() => onPromptGenerated(generatedPrompt)}
              className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
              title={language === 'ru' ? 'Редактировать' : 'Edit'}
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Fetch Reality Button */}
          {!realityFetched && (
            <Button
              variant="outline"
              className="w-full gap-2 rounded-xl border-dashed hover:border-accent/50 hover:bg-accent/5"
              onClick={fetchReality}
              disabled={isFetchingReality}
            >
              {isFetchingReality ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === 'ru' ? 'Загружаем данные рынка...' : 'Fetching market data...'}
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-accent" />
                  {language === 'ru' ? 'Получить реальные данные рынка' : 'Fetch reality (public web)'}
                </>
              )}
            </Button>
          )}

          {/* Market Data Display */}
          {marketData && (
            <div className="p-4 bg-accent/5 rounded-xl border border-accent/20 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium text-accent">
                  {language === 'ru' ? 'Данные рынка загружены' : 'Market data loaded'}
                </span>
              </div>
              <ul className="space-y-2">
                {marketData.bullets.slice(0, 3).map((bullet, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span className="line-clamp-2">{bullet}</span>
                  </li>
                ))}
              </ul>
              {marketData.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-accent/10">
                  <span className="text-xs text-muted-foreground/70">
                    {language === 'ru' ? 'Источники:' : 'Sources:'}{' '}
                    {marketData.sources.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener" className="hover:text-accent">
                        [{i + 1}]
                      </a>
                    )).reduce((prev, curr, i) => [prev, ' ', curr] as any)}
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-xs text-destructive text-center bg-destructive/10 py-2 px-3 rounded-lg">{error}</p>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="gap-1.5 rounded-lg"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              {language === 'ru' ? 'Другой' : 'New'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="rounded-lg"
            >
              {language === 'ru' ? 'Сначала' : 'Reset'}
            </Button>
            <Button
              className="flex-1 gap-2 rounded-lg bg-primary hover:bg-primary/90"
              onClick={handleConfirmPrompt}
            >
              <Rocket className="w-4 h-4" />
              {language === 'ru' ? 'Запустить' : 'Launch'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptGenerator;
