import { useState, useEffect, forwardRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Sparkles, Rocket, Target, Zap, X } from 'lucide-react';

interface DemoOnboardingProps {
  onDismiss: () => void;
}

const TIPS = [
  { 
    icon: Rocket, 
    keyEn: 'Pick region & industry', 
    keyRu: 'Выберите регион и отрасль' 
  },
  { 
    icon: Zap, 
    keyEn: 'AI builds your OS', 
    keyRu: 'AI создаёт систему' 
  },
  { 
    icon: Target, 
    keyEn: 'Run test day as CEO', 
    keyRu: 'Тестовый день CEO' 
  },
];

const DemoOnboarding = forwardRef<HTMLDivElement, DemoOnboardingProps>(({ onDismiss }, ref) => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 200);
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={ref}
      className="mb-4 animate-fade-in"
    >
      <div 
        className="relative p-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 cursor-pointer hover:border-primary/40 transition-all"
        onClick={handleDismiss}
      >
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span className="text-xs font-medium text-foreground">
            {language === 'ru' ? 'Как это работает' : 'How it works'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {TIPS.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div 
                key={i} 
                className="flex items-center gap-1.5 opacity-0 animate-fade-in"
                style={{ animationDelay: `${i * 200}ms`, animationFillMode: 'forwards' }}
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon className="w-2.5 h-2.5 text-primary" />
                </div>
                <span className="text-xs text-foreground">
                  {language === 'ru' ? tip.keyRu : tip.keyEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

DemoOnboarding.displayName = 'DemoOnboarding';

export default DemoOnboarding;
