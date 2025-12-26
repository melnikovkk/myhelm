import { useState, useRef } from 'react';
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
  Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { REGIONS, INDUSTRIES } from '@/lib/regionData';

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
  
  // Double-click protection
  const isGeneratingRef = useRef(false);

  const handleQuickStart = async (mode: 'zero' | 'digitize') => {
    // Double-click protection
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
      <div className="py-8 animate-fade-in">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {language === 'ru' ? 'Создаём ваш бизнес...' : 'Creating your business...'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
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
    <div className="space-y-6">
      {/* Context Selectors - Clean inline design */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Region Picker */}
        <div className="relative">
          <button
            onClick={() => { setShowRegionPicker(!showRegionPicker); setShowIndustryPicker(false); }}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border transition-all"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-foreground font-medium">
              {state.region && (language === 'ru' ? state.region.nameRu : state.region.nameEn)}
            </span>
            <span className="text-xs text-muted-foreground font-mono">{state.region?.currencySymbol}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showRegionPicker ? 'rotate-180' : ''}`} />
          </button>
          {showRegionPicker && (
            <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl animate-scale-in">
              <div className="p-1.5 max-h-64 overflow-y-auto">
                {REGIONS.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => { actions.setRegion(region); setShowRegionPicker(false); }}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center justify-between ${
                      state.region?.code === region.code 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-secondary/70 text-foreground'
                    }`}
                  >
                    <span>{language === 'ru' ? region.nameRu : region.nameEn}</span>
                    <span className="text-xs text-muted-foreground font-mono">{region.currencySymbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <span className="text-muted-foreground text-sm">×</span>

        {/* Industry Picker */}
        <div className="relative">
          <button
            onClick={() => { setShowIndustryPicker(!showIndustryPicker); setShowRegionPicker(false); }}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border transition-all"
          >
            <Briefcase className="w-4 h-4 text-accent" />
            <span className="text-foreground font-medium">
              {state.industry && (language === 'ru' ? state.industry.labelRu : state.industry.labelEn)}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showIndustryPicker ? 'rotate-180' : ''}`} />
          </button>
          {showIndustryPicker && (
            <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl animate-scale-in">
              <div className="p-1.5">
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry.key}
                    onClick={() => { actions.setIndustry(industry); setShowIndustryPicker(false); }}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                      state.industry?.key === industry.key 
                        ? 'bg-accent/10 text-accent' 
                        : 'hover:bg-secondary/70 text-foreground'
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

      {/* Main Action Buttons - Two clear paths */}
      <div className="space-y-3">
        {/* Primary CTA: Start New Business */}
        <Button
          onClick={() => handleQuickStart('zero')}
          disabled={isGenerating}
          size="lg"
          className="w-full gap-3 text-lg font-semibold h-14 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/35 hover:scale-[1.02] transition-all duration-300"
        >
          <Rocket className="w-5 h-5" />
          {language === 'ru' ? 'Запустить новый бизнес' : 'Launch New Business'}
          <ArrowRight className="w-5 h-5" />
        </Button>

        {/* Secondary CTA: Digitize Existing */}
        <Button
          onClick={() => handleQuickStart('digitize')}
          disabled={isGenerating}
          variant="outline"
          size="lg"
          className="w-full gap-3 text-base font-medium h-12 rounded-xl border-2 border-accent/30 hover:border-accent hover:bg-accent/5 transition-all duration-300"
        >
          <Zap className="w-5 h-5 text-accent" />
          {language === 'ru' ? 'Оцифровать существующий бизнес' : 'Digitize Existing Business'}
        </Button>
      </div>

      {error && (
        <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-destructive" />
          </button>
        </div>
      )}

      {/* Demo Example Link */}
      <div className="relative flex items-center justify-center pt-2">
        <div className="absolute inset-x-0 top-1/2 h-px bg-border/50" />
        <button 
          onClick={onUseCanon}
          className="relative px-4 py-1.5 text-xs text-muted-foreground bg-card hover:text-primary hover:bg-primary/5 rounded-full border border-border/50 hover:border-primary/30 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {language === 'ru' ? 'Или посмотрите пример' : 'Or see a demo example'}
        </button>
      </div>
    </div>
  );
};

export default PromptGenerator;
