import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Pencil, Play, ArrowRight, RotateCcw, Zap } from 'lucide-react';
import BusinessSimulator from './BusinessSimulator';
import PromptGenerator from './PromptGenerator';
import heroAbstract from '@/assets/hero-abstract.jpg';

const Hero = () => {
  const { t, language } = useLanguage();
  const { 
    state, 
    showWizard, 
    showSimulator, 
    isLaunchEnabled,
    actions 
  } = useDemo();

  const handlePromptChange = (value: string) => {
    actions.setPrompt(value, 'edited');
  };

  const handleLaunch = () => {
    if (!isLaunchEnabled || state.uiState === 'LAUNCHING') return;
    actions.setEditing(false);
    actions.launch();
  };

  const getCanonPrompt = () => {
    return language === 'ru' ? t('canon.prompt.ru') : t('canon.prompt.en');
  };

  const handleUseCanon = () => {
    actions.setPrompt(getCanonPrompt(), 'canon');
    actions.setMode('zero');
  };

  return (
    <section className="relative min-h-screen">
      {/* Hero Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-8"
          style={{ backgroundImage: `url(${heroAbstract})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
        <div className="absolute inset-0 surface-dots opacity-30" />
      </div>
      
      {/* Hero Content - Pre-simulator state */}
      {!showSimulator && (
        <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 flex items-center min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              {/* Badge */}
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 opacity-0 animate-fade-in border border-primary/20" 
                style={{ animationFillMode: 'forwards' }}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Business Autopilot</span>
                <Zap className="w-4 h-4" />
              </div>
              
              {/* Headline */}
              <h1 
                className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-[1.08] tracking-tight opacity-0 animate-fade-in-up" 
                style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
              >
                <span className="text-gradient">{t('hero.headline')}</span>
              </h1>
              
              {/* Subheadline */}
              <p 
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-up leading-relaxed" 
                style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
              >
                {t('hero.subheadline')}
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {/* Main Demo Card */}
              {(showWizard || state.prompt) && (
                <div 
                  className="glass-card p-6 md:p-8 opacity-0 animate-scale-in" 
                  style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
                >
                  {/* Wizard Mode */}
                  {showWizard && (
                    <PromptGenerator onUseCanon={handleUseCanon} />
                  )}

                  {/* Prompt Ready */}
                  {!showWizard && (
                    <>
                      {/* Context badges */}
                      {(state.region || state.industry) && (
                        <div className="flex flex-wrap items-center gap-2 mb-5">
                          {state.region && (
                            <span className="pill-primary">
                              {language === 'ru' ? state.region.nameRu : state.region.nameEn}
                              <span className="mx-1.5 opacity-40">•</span>
                              <span className="font-semibold">{state.region.currencySymbol}</span>
                            </span>
                          )}
                          {state.industry && (
                            <span className="pill-accent">
                              {language === 'ru' ? state.industry.labelRu : state.industry.labelEn}
                            </span>
                          )}
                          <span className={`pill ${
                            state.mode === 'digitize' 
                              ? 'bg-accent/10 text-accent' 
                              : 'bg-success/10 text-success'
                          }`}>
                            {state.mode === 'digitize' 
                              ? (language === 'ru' ? 'Оцифровка' : 'Digitize')
                              : (language === 'ru' ? 'С нуля' : 'From Zero')
                            }
                          </span>
                        </div>
                      )}

                      {state.isEditing ? (
                        <div className="mb-6">
                          <Textarea
                            value={state.prompt}
                            onChange={(e) => handlePromptChange(e.target.value)}
                            placeholder={t('hero.prompt.placeholder')}
                            className="min-h-[140px] bg-secondary/50 border-border focus:border-primary resize-none text-base rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="mb-6">
                          <div className="relative p-5 bg-secondary rounded-xl group hover:bg-secondary/80 transition-colors">
                            <p className="text-base text-foreground leading-relaxed pr-10">
                              {state.prompt}
                            </p>
                            <button
                              onClick={() => actions.setEditing(true)}
                              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-all"
                              title={language === 'ru' ? 'Редактировать' : 'Edit'}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <button 
                              onClick={actions.startOver}
                              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-secondary"
                            >
                              <RotateCcw className="w-4 h-4" />
                              {language === 'ru' ? 'Начать заново' : 'Start over'}
                            </button>
                            <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                              state.prompt.length >= 10 
                                ? 'text-success bg-success/10' 
                                : 'text-muted-foreground bg-muted'
                            }`}>
                              {state.prompt.length >= 10 ? '✓ Ready' : `${state.prompt.length}/10`}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Launch Button */}
                      <Button
                        onClick={handleLaunch}
                        disabled={!isLaunchEnabled}
                        size="lg"
                        className={`w-full gap-3 text-base font-semibold rounded-xl h-14 transition-all ${
                          isLaunchEnabled 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-glow hover:scale-[1.01]' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Play className="w-5 h-5" />
                        {t('hero.launch')}
                        <ArrowRight className="w-5 h-5" />
                      </Button>

                      {state.isEditing && (
                        <div className="mt-4 flex justify-end">
                          <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                            state.prompt.length >= 10 
                              ? 'text-success bg-success/10' 
                              : 'text-muted-foreground bg-muted'
                          }`}>
                            {state.prompt.length}/10+
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Simulator - Full Width */}
      {showSimulator && (
        <div className="relative pt-20 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <BusinessSimulator />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
