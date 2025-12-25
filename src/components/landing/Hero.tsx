import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Sparkles, Pencil, CheckCircle2 } from 'lucide-react';
import BusinessSimulator, { SimulatorState } from './BusinessSimulator';
import PromptGenerator from './PromptGenerator';
import heroBg from '@/assets/hero-bg.jpg';

interface MarketSnapshot {
  bullets: string[];
  sources: { title: string; url: string }[];
}

const Hero = () => {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<SimulatorState>('EMPTY');
  const [showWizard, setShowWizard] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [marketData, setMarketData] = useState<MarketSnapshot | null>(null);

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
    setIsEditing(false);
    setState('LAUNCHING');
    // Note: BusinessSimulator handles transition to ARTIFACTS after AI generation completes
  };

  const handleEditPrompt = () => {
    setState('TYPED');
    setIsEditing(true);
  };

  const getCanonPrompt = () => {
    return language === 'ru' ? t('canon.prompt.ru') : t('canon.prompt.en');
  };

  const handleUseCanon = () => {
    setPrompt(getCanonPrompt());
    setShowWizard(false);
    setState('TYPED');
    setMarketData(null);
  };

  const handlePromptGenerated = (generatedPrompt: string, data?: MarketSnapshot) => {
    setPrompt(generatedPrompt);
    setShowWizard(false);
    setState('TYPED');
    if (data) {
      setMarketData(data);
    }
  };

  const handleStartOver = () => {
    setPrompt('');
    setState('EMPTY');
    setShowWizard(true);
    setIsEditing(false);
    setMarketData(null);
  };

  const showSimulator = ['ARTIFACTS', 'RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ru' ? 'AI-Powered Business Autopilot' : 'AI-Powered Business Autopilot'}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="text-gradient">{t('hero.headline')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subheadline')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 md:p-8 rounded-2xl">
            {/* Wizard Mode: Show prompt generator */}
            {showWizard && !prompt && (
              <PromptGenerator 
                onPromptGenerated={handlePromptGenerated}
                onUseCanon={handleUseCanon}
              />
            )}

            {/* Prompt Ready: Show prompt with launch button */}
            {(!showWizard || prompt) && (
              <>
                {isEditing ? (
                  <div className="mb-6">
                    <Textarea
                      value={prompt}
                      onChange={(e) => handlePromptChange(e.target.value)}
                      placeholder={t('hero.prompt.placeholder')}
                      className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 resize-none text-base rounded-xl"
                      disabled={state === 'LAUNCHING'}
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="relative p-4 bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl border border-border/50 group hover:border-primary/30 transition-colors">
                      <p className="text-base text-foreground leading-relaxed pr-8">
                        {prompt}
                      </p>
                      {state !== 'LAUNCHING' && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title={language === 'ru' ? 'Редактировать' : 'Edit'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Market data indicator */}
                    {marketData && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-accent">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'ru' ? 'Данные рынка загружены' : 'Market data loaded'}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <button 
                        onClick={handleStartOver}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {language === 'ru' ? 'Другой промпт' : 'Different prompt'}
                      </button>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${prompt.length >= 10 ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'}`}>
                        {prompt.length >= 10 ? '✓' : prompt.length}/10+
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleLaunch}
                  disabled={!isLaunchEnabled || state === 'LAUNCHING'}
                  size="lg"
                  className={`w-full gap-3 text-lg font-semibold transition-all duration-300 rounded-xl ${
                    isLaunchEnabled && state !== 'LAUNCHING' 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {state === 'LAUNCHING' ? (
                    <><div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />{t('hero.launching')}</>
                  ) : (
                    <><Rocket className="w-5 h-5" />{t('hero.launch')}</>
                  )}
                </Button>

                {isEditing && (
                  <div className="mt-3 flex justify-end">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${prompt.length >= 10 ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'}`}>
                      {prompt.length}/10+
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {showSimulator && (
            <BusinessSimulator state={state} setState={setState} prompt={prompt} onEditPrompt={handleEditPrompt} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
