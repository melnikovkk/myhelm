import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Loader2, 
  Rocket,
  Zap,
  ArrowRight,
  Play,
  Globe,
  Briefcase,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { REGIONS, INDUSTRIES, RegionConfig, IndustryConfig } from '@/lib/regionData';

type Mode = 'zero' | 'digitize';

interface PromptGeneratorProps {
  onPromptGenerated: (prompt: string, mode: Mode, region: RegionConfig, industry: IndustryConfig) => void;
  onUseCanon: () => void;
}

const PromptGenerator = ({ onPromptGenerated, onUseCanon }: PromptGeneratorProps) => {
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Combined state - region and industry are now inside the wizard
  const [selectedRegion, setSelectedRegion] = useState<RegionConfig>(REGIONS.find(r => r.code === 'DE') || REGIONS[0]);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryConfig>(INDUSTRIES.find(i => i.key === 'service') || INDUSTRIES[0]);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);

  const handleQuickStart = async (mode: Mode) => {
    setIsGenerating(true);
    setError(null);

    try {
      const regionName = language === 'ru' ? selectedRegion.nameRu : selectedRegion.nameEn;
      const industryName = language === 'ru' ? selectedIndustry.labelRu : selectedIndustry.labelEn;

      const { data, error: fnError } = await supabase.functions.invoke('generate-demo-prompt', {
        body: {
          mode,
          businessType: selectedIndustry.key,
          location: regionName,
          locale: language,
          regionCode: selectedRegion.code,
          currency: selectedRegion.currency,
          industryKey: selectedIndustry.key,
          industryName: industryName,
        },
      });

      if (fnError) throw fnError;

      if (data?.prompt) {
        onPromptGenerated(data.prompt, mode, selectedRegion, selectedIndustry);
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
              {language === 'ru' 
                ? `${selectedIndustry.labelRu} в ${selectedRegion.nameRu}` 
                : `${selectedIndustry.labelEn} in ${selectedRegion.nameEn}`}
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
              {language === 'ru' ? selectedRegion.nameRu : selectedRegion.nameEn}
            </span>
            <span className="text-xs text-muted-foreground font-mono">{selectedRegion.currencySymbol}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showRegionPicker ? 'rotate-180' : ''}`} />
          </button>
          {showRegionPicker && (
            <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl animate-scale-in">
              <div className="p-1.5 max-h-64 overflow-y-auto">
                {REGIONS.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => { setSelectedRegion(region); setShowRegionPicker(false); }}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center justify-between ${
                      selectedRegion.code === region.code 
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
              {language === 'ru' ? selectedIndustry.labelRu : selectedIndustry.labelEn}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showIndustryPicker ? 'rotate-180' : ''}`} />
          </button>
          {showIndustryPicker && (
            <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl animate-scale-in">
              <div className="p-1.5">
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry.key}
                    onClick={() => { setSelectedIndustry(industry); setShowIndustryPicker(false); }}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                      selectedIndustry.key === industry.key 
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