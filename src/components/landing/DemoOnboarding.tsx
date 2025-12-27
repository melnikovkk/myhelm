import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { X, Sparkles, Rocket, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DemoOnboardingProps {
  onDismiss: () => void;
}

const TIPS = [
  { 
    icon: Rocket, 
    keyEn: 'Pick a region & industry, then launch a business', 
    keyRu: 'Выберите регион и отрасль, затем запустите бизнес' 
  },
  { 
    icon: Zap, 
    keyEn: 'Watch AI build your operating system in seconds', 
    keyRu: 'Смотрите, как AI создаёт вашу операционную систему за секунды' 
  },
  { 
    icon: Target, 
    keyEn: 'Run a test day and make CEO decisions', 
    keyRu: 'Запустите тестовый день и примите CEO решения' 
  },
];

const DemoOnboarding = ({ onDismiss }: DemoOnboardingProps) => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentTip < TIPS.length - 1) {
      const timer = setTimeout(() => setCurrentTip(prev => prev + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTip]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="absolute inset-x-0 -top-2 transform -translate-y-full z-20 animate-fade-in-up">
      <div className="glass-card p-4 rounded-xl border-primary/30 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            {language === 'ru' ? 'Как это работает' : 'How it works'}
          </span>
        </div>

        <div className="space-y-2">
          {TIPS.map((tip, i) => {
            const Icon = tip.icon;
            const isActive = i <= currentTip;
            return (
              <div 
                key={i} 
                className={`flex items-center gap-3 transition-all duration-500 ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-2'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                }`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className={`text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {language === 'ru' ? tip.keyRu : tip.keyEn}
                </span>
              </div>
            );
          })}
        </div>

        {currentTip >= TIPS.length - 1 && (
          <Button 
            onClick={handleDismiss} 
            size="sm" 
            className="w-full mt-3 bg-primary/10 text-primary hover:bg-primary/20"
          >
            {language === 'ru' ? 'Понятно!' : 'Got it!'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DemoOnboarding;
