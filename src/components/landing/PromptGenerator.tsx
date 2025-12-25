import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
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
  Pencil
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Mode = 'zero' | 'digitize' | null;
type BusinessType = 'service' | 'ecommerce' | 'creator' | 'other' | null;
type Step = 'mode' | 'business' | 'location' | 'generating' | 'ready';

interface PromptGeneratorProps {
  onPromptGenerated: (prompt: string) => void;
  onUseCanon: () => void;
}

const BUSINESS_TYPES = [
  { key: 'service', icon: Building2, labelEn: 'Service', labelRu: 'Услуги' },
  { key: 'ecommerce', icon: ShoppingCart, labelEn: 'E-commerce', labelRu: 'E-commerce' },
  { key: 'creator', icon: User, labelEn: 'Creator', labelRu: 'Автор/Блогер' },
  { key: 'other', icon: HelpCircle, labelEn: 'Other', labelRu: 'Другое' },
] as const;

const PromptGenerator = ({ onPromptGenerated, onUseCanon }: PromptGeneratorProps) => {
  const { language } = useLanguage();
  const [step, setStep] = useState<Step>('mode');
  const [mode, setMode] = useState<Mode>(null);
  const [businessType, setBusinessType] = useState<BusinessType>(null);
  const [location, setLocation] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode);
    setStep('business');
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

  const generatePrompt = async (type: BusinessType, loc: string) => {
    setStep('generating');
    setIsGenerating(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-demo-prompt', {
        body: {
          mode,
          businessType: type,
          location: loc,
          locale: language,
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

  const handleConfirmPrompt = () => {
    onPromptGenerated(generatedPrompt);
  };

  const handleEditPrompt = () => {
    // Allow editing - just confirm with current text
    onPromptGenerated(generatedPrompt);
  };

  const handleRegenerate = async () => {
    await generatePrompt(businessType, location);
  };

  const handleReset = () => {
    setStep('mode');
    setMode(null);
    setBusinessType(null);
    setLocation('');
    setGeneratedPrompt('');
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Step 1: Mode Selection */}
      {step === 'mode' && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-sm text-muted-foreground text-center mb-4">
            {language === 'ru' ? 'Выберите сценарий:' : 'Choose your scenario:'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 px-4 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5"
              onClick={() => handleModeSelect('zero')}
            >
              <Rocket className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">
                {language === 'ru' ? 'Начать с нуля' : 'Start from zero'}
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 px-4 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5"
              onClick={() => handleModeSelect('digitize')}
            >
              <RefreshCw className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium">
                {language === 'ru' ? 'Оцифровать бизнес' : 'Digitize existing'}
              </span>
            </Button>
          </div>
          
          {error && (
            <p className="text-xs text-destructive text-center">{error}</p>
          )}
          
          <button 
            onClick={onUseCanon}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1.5 mt-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ru' ? 'Использовать готовый пример' : 'Use demo example'}
          </button>
        </div>
      )}

      {/* Step 2: Business Type */}
      {step === 'business' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Тип бизнеса:' : 'Business type:'}
            </p>
            <button 
              onClick={handleReset}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {language === 'ru' ? '← Назад' : '← Back'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BUSINESS_TYPES.map(({ key, icon: Icon, labelEn, labelRu }) => (
              <Button
                key={key}
                variant="outline"
                className="h-auto py-3 px-3 flex items-center gap-2 hover:border-primary hover:bg-primary/5"
                onClick={() => handleBusinessSelect(key as BusinessType)}
              >
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {language === 'ru' ? labelRu : labelEn}
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Location (optional) */}
      {step === 'location' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {language === 'ru' ? 'Город/страна (опционально):' : 'City/country (optional):'}
            </p>
            <button 
              onClick={() => setStep('business')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {language === 'ru' ? '← Назад' : '← Back'}
            </button>
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={language === 'ru' ? 'Например: Берлин' : 'e.g., Berlin'}
            className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-lg text-sm focus:border-primary/50 focus:outline-none"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => generatePrompt(businessType, '')}
            >
              {language === 'ru' ? 'Пропустить' : 'Skip'}
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleLocationSubmit}
            >
              <Sparkles className="w-4 h-4" />
              {language === 'ru' ? 'Сгенерировать' : 'Generate'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Generating */}
      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">
            {language === 'ru' ? 'Генерируем идеальный промпт...' : 'Generating your perfect prompt...'}
          </p>
        </div>
      )}

      {/* Step 5: Ready - Show generated prompt */}
      {step === 'ready' && (
        <div className="space-y-4 animate-fade-in">
          <div className="relative">
            <div className="p-4 bg-secondary/50 rounded-lg border border-border/50">
              <p className="text-sm text-foreground leading-relaxed">
                {generatedPrompt}
              </p>
            </div>
            <button
              onClick={handleEditPrompt}
              className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded"
              title={language === 'ru' ? 'Редактировать' : 'Edit'}
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              {language === 'ru' ? 'Другой' : 'Regenerate'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              {language === 'ru' ? 'Сначала' : 'Start over'}
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleConfirmPrompt}
            >
              <Rocket className="w-4 h-4" />
              {language === 'ru' ? 'Запустить' : 'Launch'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptGenerator;
