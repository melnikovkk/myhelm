import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Sparkles, Pencil } from 'lucide-react';
import BusinessSimulator, { SimulatorState } from './BusinessSimulator';
import PromptGenerator from './PromptGenerator';

const Hero = () => {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<SimulatorState>('EMPTY');
  const [showWizard, setShowWizard] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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
    setTimeout(() => setState('ARTIFACTS'), 1500);
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
  };

  const handlePromptGenerated = (generatedPrompt: string) => {
    setPrompt(generatedPrompt);
    setShowWizard(false);
    setState('TYPED');
  };

  const handleStartOver = () => {
    setPrompt('');
    setState('EMPTY');
    setShowWizard(true);
    setIsEditing(false);
  };

  const showSimulator = ['ARTIFACTS', 'RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="text-gradient">{t('hero.headline')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subheadline')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 md:p-8">
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
                      className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 resize-none text-base"
                      disabled={state === 'LAUNCHING'}
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="relative p-4 bg-secondary/50 rounded-lg border border-border/50">
                      <p className="text-base text-foreground leading-relaxed pr-8">
                        {prompt}
                      </p>
                      {state !== 'LAUNCHING' && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
                          title={language === 'ru' ? 'Редактировать' : 'Edit'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <button 
                        onClick={handleStartOver}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        {language === 'ru' ? 'Другой промпт' : 'Different prompt'}
                      </button>
                      <span className={`text-xs font-mono ${prompt.length >= 10 ? 'text-success' : 'text-muted-foreground'}`}>
                        {prompt.length}/10+
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleLaunch}
                  disabled={!isLaunchEnabled || state === 'LAUNCHING'}
                  size="lg"
                  className={`w-full gap-3 text-lg font-semibold transition-all duration-300 ${
                    isLaunchEnabled && state !== 'LAUNCHING' ? 'bg-primary text-primary-foreground btn-glow animate-pulse-glow' : 'bg-muted text-muted-foreground'
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
                    <span className={`text-xs font-mono ${prompt.length >= 10 ? 'text-success' : 'text-muted-foreground'}`}>
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
