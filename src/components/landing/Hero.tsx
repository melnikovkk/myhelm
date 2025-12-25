import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Sparkles } from 'lucide-react';

// Demo state machine states
type SimulatorState = 
  | 'EMPTY'       // 0: prompt empty
  | 'TYPED'       // 1: >=10 chars
  | 'LAUNCHING'   // 2: compiling
  | 'ARTIFACTS'   // 3: revealed
  | 'RUNNING'     // 4: test day
  | 'DECISION'    // 5: boss decision
  | 'DECIDED'     // 6: decision made
  | 'EVIDENCE'    // 7: trophies
  | 'REPLAY';     // 8: scrubber active

const Hero = () => {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<SimulatorState>('EMPTY');

  const isLaunchEnabled = prompt.length >= 10;

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (value.length >= 10 && state === 'EMPTY') {
      setState('TYPED');
    } else if (value.length < 10 && state === 'TYPED') {
      setState('EMPTY');
    }
  };

  const handleLaunch = () => {
    if (!isLaunchEnabled || state === 'LAUNCHING') return;
    
    setState('LAUNCHING');
    // Transition to ARTIFACTS after 1.5s
    setTimeout(() => {
      setState('ARTIFACTS');
    }, 1500);
  };

  const getCanonPrompt = () => {
    return language === 'ru' 
      ? t('canon.prompt.ru')
      : t('canon.prompt.en');
  };

  const handleUseExample = () => {
    const examplePrompt = getCanonPrompt();
    setPrompt(examplePrompt);
    setState('TYPED');
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Copy */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="text-gradient">{t('hero.headline')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subheadline')}
          </p>
        </div>

        {/* Launch Business Widget */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 md:p-8">
            {/* Prompt Input */}
            <div className="mb-6">
              <Textarea
                value={prompt}
                onChange={(e) => handlePromptChange(e.target.value)}
                placeholder={t('hero.prompt.placeholder')}
                className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 resize-none text-base"
                disabled={state === 'LAUNCHING'}
              />
              
              {/* Example prompt link */}
              {prompt.length < 10 && (
                <button
                  onClick={handleUseExample}
                  className="mt-2 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'ru' ? 'Попробовать пример' : 'Try an example'}
                </button>
              )}
            </div>

            {/* Launch Button */}
            <Button
              onClick={handleLaunch}
              disabled={!isLaunchEnabled || state === 'LAUNCHING'}
              size="lg"
              className={`w-full gap-3 text-lg font-semibold transition-all duration-300 ${
                isLaunchEnabled && state !== 'LAUNCHING'
                  ? 'bg-primary text-primary-foreground btn-glow animate-pulse-glow'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {state === 'LAUNCHING' ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t('hero.launching')}
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  {t('hero.launch')}
                </>
              )}
            </Button>

            {/* Character count indicator */}
            <div className="mt-3 flex justify-end">
              <span className={`text-xs font-mono ${prompt.length >= 10 ? 'text-success' : 'text-muted-foreground'}`}>
                {prompt.length}/10+
              </span>
            </div>
          </div>

          {/* Placeholder for Simulator Widget - will be expanded in Phase 3-6 */}
          {state === 'ARTIFACTS' && (
            <div className="mt-8 animate-fade-in-up">
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground">
                  {language === 'ru' 
                    ? '✨ Бизнес скомпилирован! (Artifacts будут добавлены в Phase 4)'
                    : '✨ Business compiled! (Artifacts will be added in Phase 4)'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
