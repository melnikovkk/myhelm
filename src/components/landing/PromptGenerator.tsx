import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Rocket,
  Zap,
  ArrowRight,
  Globe,
  Briefcase,
  ChevronDown,
  RefreshCw,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { clearPersistedSession } from '@/lib/demoStore';
import { supabase } from '@/integrations/supabase/client';
import { REGIONS, INDUSTRIES } from '@/lib/regionData';
import DemoOnboarding from './DemoOnboarding';

const ONBOARDING_KEY = 'helm-demo-onboarding-seen';

interface PromptGeneratorProps {
  onUseCanon: () => void;
}

const PromptGenerator = ({ onUseCanon }: PromptGeneratorProps) => {
  const { language } = useLanguage();
  const { state, actions } = useDemo();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const isGeneratingRef = useRef(false);
  
  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      setShowOnboarding(true);
    }
  }, []);
  
  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, 'true');
  };

  const handleQuickStart = async (mode: 'zero' | 'digitize') => {
    if (isGeneratingRef.current || isGenerating) return;
    isGeneratingRef.current = true;
    
    setIsGenerating(true);
    setError(null);
    actions.setMode(mode);

    try {
      const region = state.region!;
      const industry = state.industry!;
      const regionName = language === 'ru' ? region.nameRu : region.nameEn;
      const industryName = language === 'ru' ? industry.labelRu : industry.labelEn;

      const { data, error: fnError } = await supabase.functions.invoke('generate-demo-prompt', {
        body: {
          mode,
          businessType: industry.key,
          location: regionName,
          locale: language,
          regionCode: region.code,
          currency: region.currency,
          industryKey: industry.key,
          industryName: industryName,
        },
      });

      if (fnError) throw fnError;

      if (data?.prompt) {
        actions.setPrompt(data.prompt, 'generated');
      } else {
        throw new Error('No prompt generated');
      }
    } catch (err) {
      console.error('Prompt generation error:', err);
      setError(language === 'ru' 
        ? 'Не удалось сгенерировать. Попробуйте снова.' 
        : 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      isGeneratingRef.current = false;
    }
  };

  if (isGenerating) {
    return (
      <div className="py-10 animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {language === 'ru' ? 'Создаём ваш бизнес...' : 'Creating your business...'}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {state.industry && state.region && (
                language === 'ru' 
                  ? `${state.industry.labelRu} в ${state.region.nameRu}` 
                  : `${state.industry.labelEn} in ${state.region.nameEn}`
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {showOnboarding && (
        <DemoOnboarding onDismiss={handleDismissOnboarding} />
      )}
      
      {/* Context Selectors */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Region Picker */}
        <div className="relative">
          <button
            onClick={() => { setShowRegionPicker(!showRegionPicker); setShowIndustryPicker(false); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl bg-secondary hover:bg-secondary/80 transition-all"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-foreground font-medium">
              {state.region && (language === 'ru' ? state.region.nameRu : state.region.nameEn)}
            </span>
            <span className="text-xs text-muted-foreground">{state.region?.currencySymbol}</span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showRegionPicker ? 'rotate-180' : ''}`} />
          </button>
          {showRegionPicker && (
            <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card border border-border rounded-2xl animate-scale-in" style={{ boxShadow: 'var(--shadow-lg)' }}>
              <div className="p-2 max-h-64 overflow-y-auto">
                {REGIONS.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => { actions.setRegion(region); setShowRegionPicker(false); }}
                    className={`w-full px-3 py-2.5 text-left text-sm rounded-xl transition-colors flex items-center justify-between ${
                      state.region?.code === region.code 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <span>{language === 'ru' ? region.nameRu : region.nameEn}</span>
                    <span className="text-xs text-muted-foreground">{region.currencySymbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="text-muted-foreground">×</span>

        {/* Industry Picker */}
        <div className="relative">
          <button
            onClick={() => { setShowIndustryPicker(!showIndustryPicker); setShowRegionPicker(false); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl bg-secondary hover:bg-secondary/80 transition-all"
          >
            <Briefcase className="w-4 h-4 text-accent" />
            <span className="text-foreground font-medium">
              {state.industry && (language === 'ru' ? state.industry.labelRu : state.industry.labelEn)}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showIndustryPicker ? 'rotate-180' : ''}`} />
          </button>
          {showIndustryPicker && (
            <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-card border border-border rounded-2xl animate-scale-in" style={{ boxShadow: 'var(--shadow-lg)' }}>
              <div className="p-2">
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry.key}
                    onClick={() => { actions.setIndustry(industry); setShowIndustryPicker(false); }}
                    className={`w-full px-3 py-2.5 text-left text-sm rounded-xl transition-colors ${
                      state.industry?.key === industry.key 
                        ? 'bg-accent/10 text-accent font-medium' 
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    {language === 'ru' ? industry.labelRu : industry.labelEn}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={() => handleQuickStart('zero')}
          disabled={isGenerating}
          size="lg"
          className="w-full gap-3 text-base font-semibold h-14 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-glow hover:scale-[1.01] transition-all"
        >
          <Rocket className="w-5 h-5" />
          {language === 'ru' ? 'Запустить новый бизнес' : 'Launch New Business'}
          <ArrowRight className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => handleQuickStart('digitize')}
          disabled={isGenerating}
          variant="outline"
          size="lg"
          className="w-full gap-3 text-base font-medium h-12 rounded-2xl border-2 border-border hover:border-accent hover:bg-accent/5 transition-all"
        >
          <Zap className="w-5 h-5 text-accent" />
          {language === 'ru' ? 'Оцифровать существующий бизнес' : 'Digitize Existing Business'}
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
          <p className="text-sm text-destructive">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="p-2 hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-destructive" />
          </button>
        </div>
      )}

      {/* Demo Example + Reset */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button 
          onClick={onUseCanon}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-primary bg-secondary/50 hover:bg-primary/5 rounded-full transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {language === 'ru' ? 'Посмотреть пример' : 'See example'}
        </button>
        <button 
          onClick={() => {
            clearPersistedSession();
            localStorage.removeItem(ONBOARDING_KEY);
            window.location.reload();
          }}
          className="px-3 py-2 text-sm text-muted-foreground hover:text-destructive bg-secondary/50 hover:bg-destructive/5 rounded-full transition-all flex items-center gap-2"
          title={language === 'ru' ? 'Сбросить демо' : 'Reset demo'}
        >
          <RotateCcw className="w-4 h-4" />
          {language === 'ru' ? 'Сброс' : 'Reset'}
        </button>
      </div>
    </div>
  );
};

export default PromptGenerator;
