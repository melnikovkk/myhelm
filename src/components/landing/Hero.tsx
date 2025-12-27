import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Pencil, Play, ArrowRight, RotateCcw } from 'lucide-react';
import BusinessSimulator from './BusinessSimulator';
import PromptGenerator from './PromptGenerator';

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
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden min-h-[90vh] flex items-center">
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 surface-dots opacity-40" />
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 opacity-0 animate-fade-in" 
            style={{ animationFillMode: 'forwards' }}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Business Autopilot</span>
          </div>
          
          {/* Headline */}
          <h1 
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight opacity-0 animate-fade-in-up" 
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            {t('hero.headline')}
          </h1>
          
          {/* Subheadline */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto opacity-0 animate-fade-in-up leading-relaxed" 
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            {t('hero.subheadline')}
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Main Demo Card */}
          {(showWizard || (state.prompt && !showSimulator)) && (
            <div 
              className="bg-card rounded-3xl border border-border/60 p-6 md:p-8 opacity-0 animate-scale-in relative overflow-hidden" 
              style={{ 
                animationDelay: '400ms', 
                animationFillMode: 'forwards',
                boxShadow: 'var(--shadow-lg)'
              }}
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
                          <span className="mx-1 opacity-40">•</span>
                          <span className="font-medium">{state.region.currencySymbol}</span>
                        </span>
                      )}
                      {state.industry && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent">
                          {language === 'ru' ? state.industry.labelRu : state.industry.labelEn}
                        </span>
                      )}
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
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
                        className="min-h-[140px] bg-secondary/50 border-border focus:border-primary resize-none text-base rounded-2xl"
                      />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="relative p-5 bg-secondary/70 rounded-2xl group hover:bg-secondary transition-colors">
                        <p className="text-base text-foreground leading-relaxed pr-10">
                          {state.prompt}
                        </p>
                        <button
                          onClick={() => actions.setEditing(true)}
                          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
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
                    className={`w-full gap-3 text-lg font-semibold rounded-2xl h-14 transition-all ${
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

          {/* Simulator */}
          {showSimulator && <BusinessSimulator />}
        </div>
      </div>
    </section>
  );
};

export default Hero;
