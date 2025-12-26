import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Pencil, Play, ArrowRight, RotateCcw } from 'lucide-react';
import BusinessSimulator from './BusinessSimulator';
import PromptGenerator from './PromptGenerator';
import heroBg from '@/assets/hero-bg.jpg';

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
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden min-h-[90vh] flex items-center">
      {/* Hero background with overlay */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Animated background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/8 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 opacity-0 animate-fade-in backdrop-blur-sm" style={{ animationFillMode: 'forwards' }}>
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ru' ? 'AI-Powered Business Autopilot' : 'AI-Powered Business Autopilot'}</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-[1.1] opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <span className="text-gradient">{t('hero.headline')}</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-up leading-relaxed" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            {t('hero.subheadline')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Main Demo Card - Only show when in wizard or editing */}
          {(showWizard || (state.prompt && !showSimulator)) && (
            <div className="glass-card p-6 md:p-8 rounded-2xl border-primary/10 shadow-2xl opacity-0 animate-scale-in relative overflow-hidden" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              {/* Subtle glow effect */}
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                {/* Wizard Mode: Show prompt generator */}
                {showWizard && (
                  <PromptGenerator 
                    onUseCanon={handleUseCanon}
                  />
                )}

                {/* Prompt Ready: Show prompt with launch button */}
                {!showWizard && (
                  <>
                    {/* Context badges */}
                    {(state.region || state.industry) && (
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {state.region && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {language === 'ru' ? state.region.nameRu : state.region.nameEn}
                            <span className="opacity-60">•</span>
                            <span className="font-mono">{state.region.currencySymbol}</span>
                          </span>
                        )}
                        {state.industry && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                            {language === 'ru' ? state.industry.labelRu : state.industry.labelEn}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
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
                          className="min-h-[140px] bg-background/60 border-border/50 focus:border-primary/50 resize-none text-base rounded-xl"
                        />
                      </div>
                    ) : (
                      <div className="mb-6">
                        <div className="relative p-5 bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl border border-border/50 group hover:border-primary/30 transition-all duration-300">
                          <p className="text-base text-foreground leading-relaxed pr-10">
                            {state.prompt}
                          </p>
                          <button
                            onClick={() => actions.setEditing(true)}
                            className="absolute top-4 right-4 p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all opacity-60 group-hover:opacity-100"
                            title={language === 'ru' ? 'Редактировать' : 'Edit'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <button 
                            onClick={actions.startOver}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-primary/5"
                          >
                            <RotateCcw className="w-4 h-4" />
                            {language === 'ru' ? 'Начать заново' : 'Start over'}
                          </button>
                          <span className={`text-xs font-mono px-3 py-1 rounded-lg ${state.prompt.length >= 10 ? 'text-success bg-success/10 border border-success/20' : 'text-muted-foreground bg-muted'}`}>
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
                      className={`w-full gap-3 text-lg font-semibold transition-all duration-300 rounded-xl h-14 ${
                        isLaunchEnabled 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02]' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Play className="w-5 h-5" />
                      {t('hero.launch')}
                      <ArrowRight className="w-5 h-5" />
                    </Button>

                    {state.isEditing && (
                      <div className="mt-4 flex justify-end">
                        <span className={`text-xs font-mono px-3 py-1 rounded-lg ${state.prompt.length >= 10 ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'}`}>
                          {state.prompt.length}/10+
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Simulator */}
          {showSimulator && (
            <BusinessSimulator />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
