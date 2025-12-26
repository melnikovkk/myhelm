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
  ArrowRight,
  Zap,
  ArrowLeft
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
  onPromptGenerated: (prompt: string, marketData?: MarketSnapshot, mode?: 'zero' | 'digitize') => void;
  onUseCanon: () => void;
  region?: RegionConfig | null;
  industry?: IndustryConfig | null;
}

const BUSINESS_TYPES = [
  { key: 'service', icon: Building2, labelEn: 'Service Business', labelRu: 'Услуги', descEn: 'Cleaning, consulting, coaching', descRu: 'Уборка, консалтинг, коучинг', color: 'primary' },
  { key: 'ecommerce', icon: ShoppingCart, labelEn: 'E-commerce', labelRu: 'E-commerce', descEn: 'Online store, dropshipping', descRu: 'Онлайн-магазин, дропшиппинг', color: 'accent' },
  { key: 'creator', icon: User, labelEn: 'Creator/Agency', labelRu: 'Автор/Агентство', descEn: 'Content, design, marketing', descRu: 'Контент, дизайн, маркетинг', color: 'success' },
  { key: 'other', icon: HelpCircle, labelEn: 'Other', labelRu: 'Другое', descEn: 'Tell us more', descRu: 'Расскажи подробнее', color: 'muted-foreground' },
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
    
    if (type === 'other' || type === 'service') {
      setStep('location');
    } else {
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
          regionCode,
          currency,
          industryKey,
          industryName,
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
      setStep('mode');
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchReality = async () => {
    setIsFetchingReality(true);
    setError(null);

    try {
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
    onPromptGenerated(generatedPrompt, marketData || undefined, mode || 'zero');
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

  const goBack = () => {
    if (step === 'business') setStep('mode');
    else if (step === 'digitize_details') setStep('mode');
    else if (step === 'location') setStep('business');
    else if (step === 'ready') setStep('mode');
  };

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
    <div className="space-y-5">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {[1, 2, 3, 4].map((dot) => (
          <div
            key={dot}
            className={`transition-all duration-500 ${
              getProgress() >= dot 
                ? 'w-8 h-2 bg-primary rounded-full' 
                : 'w-2 h-2 bg-border rounded-full'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Mode Selection */}
      {step === 'mode' && (
        <div className="space-y-5 animate-fade-in">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {language === 'ru' ? 'Как хотите начать?' : 'How would you like to start?'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Выберите сценарий запуска' : 'Choose your launch scenario'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              className="group relative h-auto py-6 px-5 flex flex-col items-center gap-4 rounded-xl border-2 border-border/50 bg-card/50 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              onClick={() => handleModeSelect('zero')}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Rocket className="w-7 h-7 text-primary" />
              </div>
              <div className="text-center">
                <span className="block text-base font-semibold text-foreground mb-1">
                  {language === 'ru' ? 'Начать с нуля' : 'Start from zero'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {language === 'ru' ? 'Новая бизнес-идея' : 'New business idea'}
                </span>
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3 h-3 text-primary" />
              </div>
            </button>
            
            <button
              className="group relative h-auto py-6 px-5 flex flex-col items-center gap-4 rounded-xl border-2 border-border/50 bg-card/50 hover:border-accent hover:bg-accent/5 transition-all duration-300"
              onClick={() => handleModeSelect('digitize')}
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                <Zap className="w-7 h-7 text-accent" />
              </div>
              <div className="text-center">
                <span className="block text-base font-semibold text-foreground mb-1">
                  {language === 'ru' ? 'Оцифровать' : 'Digitize existing'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {language === 'ru' ? 'Уже работающий бизнес' : 'Already running business'}
                </span>
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3 h-3 text-accent" />
              </div>
            </button>
          </div>
          
          {error && (
            <p className="text-sm text-destructive text-center bg-destructive/10 py-3 px-4 rounded-lg">{error}</p>
          )}
          
          <div className="relative flex items-center justify-center pt-2">
            <div className="absolute inset-x-0 top-1/2 h-px bg-border/50" />
            <span className="relative px-4 text-xs text-muted-foreground bg-card">
              {language === 'ru' ? 'или попробуйте демо' : 'or try our demo'}
            </span>
          </div>
          
          <button 
            onClick={onUseCanon}
            className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/40 hover:bg-primary/5"
          >
            <Sparkles className="w-4 h-4" />
            {language === 'ru' ? 'Использовать готовый пример' : 'Use demo example'}
          </button>
        </div>
      )}

      {/* Step 2: Business Type */}
      {step === 'business' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {language === 'ru' ? 'Тип бизнеса' : 'Business type'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ru' ? 'Что вы хотите построить?' : 'What do you want to build?'}
              </p>
            </div>
            <button 
              onClick={goBack}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {BUSINESS_TYPES.map(({ key, icon: Icon, labelEn, labelRu, descEn, descRu, color }) => (
              <button
                key={key}
                className={`group h-auto py-5 px-4 flex flex-col items-center gap-3 rounded-xl border-2 border-border/50 bg-card/50 hover:border-${color} hover:bg-${color}/5 transition-all duration-300`}
                onClick={() => handleBusinessSelect(key as BusinessType)}
              >
                <div className={`w-12 h-12 rounded-xl bg-${color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${color}`} />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-medium text-foreground">
                    {language === 'ru' ? labelRu : labelEn}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {language === 'ru' ? descRu : descEn}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2b: Digitize Details */}
      {step === 'digitize_details' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {language === 'ru' ? 'О вашем бизнесе' : 'About your business'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ru' ? 'Расскажите, что хотите оцифровать' : 'Tell us what you want to digitize'}
              </p>
            </div>
            <button 
              onClick={goBack}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === 'ru' ? 'Название / тип бизнеса' : 'Business name / type'}
              </label>
              <input
                type="text"
                value={existingBusinessName}
                onChange={(e) => setExistingBusinessName(e.target.value)}
                placeholder={language === 'ru' ? 'Например: Автомастерская "Мотор"' : 'e.g., "Motor" Auto Repair Shop'}
                className="w-full px-4 py-3 bg-background/60 border-2 border-border/50 rounded-xl text-base focus:border-accent focus:outline-none transition-colors placeholder:text-muted-foreground/50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === 'ru' ? 'Что хотите улучшить?' : 'What do you want to improve?'}
              </label>
              <textarea
                value={painPoints}
                onChange={(e) => setPainPoints(e.target.value)}
                placeholder={language === 'ru' 
                  ? 'Например: учёт клиентов в блокноте, забываю перезванивать...' 
                  : 'e.g., tracking clients in a notebook, forgetting callbacks...'}
                className="w-full px-4 py-3 bg-background/60 border-2 border-border/50 rounded-xl text-base focus:border-accent focus:outline-none transition-colors placeholder:text-muted-foreground/50 min-h-[100px] resize-none"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === 'ru' ? 'Город (опционально)' : 'City (optional)'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={language === 'ru' ? 'Например: Москва' : 'e.g., Berlin'}
                className="w-full px-4 py-3 bg-background/60 border-2 border-border/50 rounded-xl text-base focus:border-accent focus:outline-none transition-colors placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
          
          <Button
            className="w-full gap-2 rounded-xl h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            onClick={handleDigitizeSubmit}
            disabled={!existingBusinessName.trim()}
          >
            <Sparkles className="w-5 h-5" />
            {language === 'ru' ? 'Создать Business Program' : 'Create Business Program'}
          </Button>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 'location' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {language === 'ru' ? 'Локация' : 'Location'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'ru' ? 'Где будет работать бизнес?' : 'Where will your business operate?'}
              </p>
            </div>
            <button 
              onClick={goBack}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
          
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={language === 'ru' ? 'Например: Берлин, Москва, NYC' : 'e.g., Berlin, Moscow, NYC'}
            className="w-full px-4 py-4 bg-background/60 border-2 border-border/50 rounded-xl text-base focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/50"
            autoFocus
          />
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-12"
              onClick={() => generatePrompt(businessType, '')}
            >
              {language === 'ru' ? 'Пропустить' : 'Skip'}
            </Button>
            <Button
              className="flex-1 gap-2 rounded-xl h-12 bg-primary hover:bg-primary/90"
              onClick={handleLocationSubmit}
              disabled={!location.trim()}
            >
              <ArrowRight className="w-4 h-4" />
              {language === 'ru' ? 'Далее' : 'Continue'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Generating */}
      {step === 'generating' && (
        <div className="space-y-5 animate-fade-in">
          <div className="relative">
            <div className="p-5 bg-gradient-to-br from-secondary/60 to-secondary/30 rounded-xl border border-border/30">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-foreground">
                {language === 'ru' ? 'Создаём идеальный промпт...' : 'Crafting your perfect prompt...'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'ru' ? 'Это займёт несколько секунд' : 'This will take a few seconds'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Ready */}
      {step === 'ready' && (
        <div className="space-y-5 animate-fade-in">
          <div className="relative group">
            <div className="p-5 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border-2 border-success/30 group-hover:border-success/50 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-success">
                  {language === 'ru' ? 'Промпт готов' : 'Prompt ready'}
                </span>
              </div>
              <p className="text-base text-foreground leading-relaxed pr-10">
                {generatedPrompt}
              </p>
            </div>
            <button
              onClick={() => onPromptGenerated(generatedPrompt)}
              className="absolute top-4 right-4 p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
              title={language === 'ru' ? 'Редактировать' : 'Edit'}
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Fetch Reality Button */}
          {!realityFetched && (
            <Button
              variant="outline"
              className="w-full gap-2 rounded-xl h-12 border-2 border-dashed hover:border-accent/50 hover:bg-accent/5"
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
            <div className="p-5 bg-accent/5 rounded-xl border-2 border-accent/20 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold text-accent">
                  {language === 'ru' ? 'Данные рынка загружены' : 'Market data loaded'}
                </span>
              </div>
              <ul className="space-y-2">
                {marketData.bullets.slice(0, 3).map((bullet, i) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                    <span className="line-clamp-2">{bullet}</span>
                  </li>
                ))}
              </ul>
              {marketData.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-accent/10">
                  <span className="text-xs text-muted-foreground">
                    {language === 'ru' ? 'Источники:' : 'Sources:'}{' '}
                    {marketData.sources.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener" className="hover:text-accent transition-colors">
                        [{i + 1}]
                      </a>
                    )).reduce((prev, curr, i) => [prev, ' ', curr] as any)}
                  </span>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive text-center bg-destructive/10 py-3 px-4 rounded-lg">{error}</p>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="gap-2 rounded-xl h-11"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {language === 'ru' ? 'Новый' : 'New'}
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-xl h-11"
            >
              {language === 'ru' ? 'Сначала' : 'Reset'}
            </Button>
            <Button
              className="flex-1 gap-2 rounded-xl h-11 bg-primary hover:bg-primary/90 font-semibold"
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