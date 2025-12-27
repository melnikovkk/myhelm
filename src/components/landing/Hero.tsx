import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Play, ArrowRight, RotateCcw } from 'lucide-react';
import BusinessSimulator from './BusinessSimulator';
import PromptGenerator from './PromptGenerator';
import dashboardPreview from '@/assets/dashboard-preview.png';

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
    <section className="relative min-h-screen bg-background">
      {/* Hero Content - Pre-simulator state */}
      {!showSimulator && (
        <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <div className="text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 border border-primary/10">
                  <span>{language === 'ru' ? 'Бизнес-автопилот на ИИ' : 'AI Business Autopilot'}</span>
                </div>
                
                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
                  {t('hero.headline')}
                </h1>
                
                {/* Subheadline */}
                <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed mb-10">
                  {t('hero.subheadline')}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                  <div>
                    <div className="text-3xl font-bold text-foreground">12</div>
                    <div className="text-sm text-muted-foreground">{language === 'ru' ? 'Доменов' : 'Domains'}</div>
                  </div>
                  <div className="w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold text-foreground">100%</div>
                    <div className="text-sm text-muted-foreground">{language === 'ru' ? 'Прозрачность' : 'Transparent'}</div>
                  </div>
                  <div className="w-px bg-border" />
                  <div>
                    <div className="text-3xl font-bold text-foreground">24/7</div>
                    <div className="text-sm text-muted-foreground">{language === 'ru' ? 'Автопилот' : 'Autopilot'}</div>
                  </div>
                </div>
              </div>

              {/* Right: Dashboard Preview */}
              <div className="relative hidden lg:block">
                <img 
                  src={dashboardPreview} 
                  alt="HELM Dashboard" 
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>

            {/* Demo Card */}
            <div className="max-w-lg mx-auto mt-16">
              {(showWizard || state.prompt) && (
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
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
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                              {language === 'ru' ? state.region.nameRu : state.region.nameEn}
                              <span className="mx-1 opacity-40">•</span>
                              {state.region.currencySymbol}
                            </span>
                          )}
                          {state.industry && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                              {language === 'ru' ? state.industry.labelRu : state.industry.labelEn}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            state.mode === 'digitize' 
                              ? 'bg-accent/10 text-accent' 
                              : 'bg-primary/10 text-primary'
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
                            className="min-h-[120px] bg-background border-border focus:border-primary resize-none text-sm"
                          />
                        </div>
                      ) : (
                        <div className="mb-6">
                          <div className="relative p-4 bg-secondary/50 rounded-lg group">
                            <p className="text-sm text-foreground leading-relaxed pr-8">
                              {state.prompt}
                            </p>
                            <button
                              onClick={() => actions.setEditing(true)}
                              className="absolute top-3 right-3 p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors"
                              title={language === 'ru' ? 'Редактировать' : 'Edit'}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <button 
                              onClick={actions.startOver}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              {language === 'ru' ? 'Заново' : 'Start over'}
                            </button>
                            <span className={`text-xs font-medium ${
                              state.prompt.length >= 10 
                                ? 'text-primary' 
                                : 'text-muted-foreground'
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
                        className="w-full gap-2 font-medium h-12"
                      >
                        <Play className="w-4 h-4" />
                        {t('hero.launch')}
                        <ArrowRight className="w-4 h-4" />
                      </Button>

                      {state.isEditing && (
                        <div className="mt-3 flex justify-end">
                          <span className={`text-xs ${
                            state.prompt.length >= 10 
                              ? 'text-primary' 
                              : 'text-muted-foreground'
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

      {/* Simulator */}
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