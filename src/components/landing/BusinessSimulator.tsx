import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Building2, Globe, Layers, Pencil, Check, RotateCcw } from 'lucide-react';
import BusinessTab from './BusinessTab';
import RegionTab from './RegionTab';
import CoverageTab from './CoverageTab';
import BossDecisionModal from './BossDecisionModal';
import { useState, useEffect } from 'react';

const LoadingStep = ({ label, delay }: { label: string; delay: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), delay);
    const completeTimer = setTimeout(() => setIsComplete(true), delay + 600);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(completeTimer);
    };
  }, [delay]);
  
  return (
    <div className={`flex items-center gap-3 transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
        isComplete ? 'bg-success/20' : 'bg-primary/20'
      }`}>
        {isComplete ? (
          <Check className="w-3.5 h-3.5 text-success" />
        ) : (
          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
        )}
      </div>
      <span className={`text-sm transition-colors ${isComplete ? 'text-success font-medium' : 'text-foreground'}`}>
        {label}
      </span>
    </div>
  );
};

const BusinessSimulator = () => {
  const { t, language } = useLanguage();
  const { 
    state, 
    canRunTestDay, 
    isRunning, 
    isReplay,
    actions 
  } = useDemo();
  
  const [activeTab, setActiveTab] = useState('business');

  // Loading state
  if (state.uiState === 'LAUNCHING') {
    return (
      <div className="animate-fade-in">
        <div className="glass-card p-8 md:p-12 max-w-lg mx-auto">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
              </div>
              <div className="absolute -inset-3 rounded-3xl border-2 border-primary/20 border-t-primary/60 animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            
            <h3 className="text-xl font-bold text-foreground text-center mb-2">
              {state.mode === 'digitize' 
                ? (language === 'ru' ? 'Создаём план оцифровки' : 'Creating digitization plan')
                : (language === 'ru' ? 'Создаём ваш бизнес' : 'Building your business')
              }
            </h3>
            
            {(state.region || state.industry) && (
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                {state.industry && (
                  <span className="pill-accent">
                    {language === 'ru' ? state.industry.labelRu : state.industry.labelEn}
                  </span>
                )}
                {state.region && (
                  <span className="pill-primary">
                    {language === 'ru' ? state.region.nameRu : state.region.nameEn}
                  </span>
                )}
              </div>
            )}
            
            <div className="space-y-3 w-full max-w-xs">
              <LoadingStep 
                label={language === 'ru' ? 'Анализ бизнес-модели' : 'Analyzing business model'} 
                delay={0} 
              />
              <LoadingStep 
                label={language === 'ru' ? 'Генерация структуры' : 'Generating structure'} 
                delay={800} 
              />
              <LoadingStep 
                label={language === 'ru' ? 'Создание операционной системы' : 'Creating operating system'} 
                delay={1600} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!state.business) return null;

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{state.business.name}</h2>
            {state.business.tagline && (
              <p className="text-sm text-muted-foreground mt-0.5">{state.business.tagline}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {state.region && (
            <span className="pill bg-secondary text-foreground font-medium">
              {language === 'ru' ? state.region.nameRu : state.region.nameEn} • {state.region.currencySymbol}
            </span>
          )}
          <button 
            onClick={actions.startOver}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            title={language === 'ru' ? 'Начать заново' : 'Start over'}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-secondary rounded-xl p-1 mb-6 h-12">
          <TabsTrigger value="business" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all text-sm font-medium gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('tab.business')}</span>
          </TabsTrigger>
          <TabsTrigger value="region" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all text-sm font-medium gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{t('tab.region')}</span>
          </TabsTrigger>
          <TabsTrigger value="coverage" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all text-sm font-medium gap-2">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{t('tab.coverage')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <BusinessTab />
        </TabsContent>

        <TabsContent value="region" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <RegionTab prompt={state.prompt} region={state.region} industry={state.industry} />
        </TabsContent>

        <TabsContent value="coverage" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <CoverageTab />
        </TabsContent>
      </Tabs>

      {/* Action Bar */}
      <div className="mt-6 p-4 md:p-5 bg-secondary/50 rounded-2xl border border-border/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${
              isRunning ? 'bg-success animate-pulse' : 
              isReplay ? 'bg-accent' : 
              'bg-primary'
            }`} />
            <span className="text-sm font-medium text-muted-foreground">
              {state.uiState === 'ARTIFACTS' && (language === 'ru' ? 'Готов к запуску' : 'Ready to run')}
              {isRunning && (language === 'ru' ? 'Тестовый день...' : 'Running test day...')}
              {isReplay && (language === 'ru' ? 'Завершено' : 'Complete')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isReplay && (
              <Button variant="ghost" size="sm" onClick={actions.requestEdit} className="gap-2 text-muted-foreground hover:text-foreground rounded-lg">
                <Pencil className="w-4 h-4" />
                {language === 'ru' ? 'Изменить' : 'Edit'}
              </Button>
            )}
            
            {canRunTestDay && (
              <Button onClick={actions.startTestDay} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md hover:shadow-glow transition-all">
                <Play className="w-4 h-4" />
                {isReplay 
                  ? (language === 'ru' ? 'Заново' : 'Run again') 
                  : (language === 'ru' ? 'Запустить день' : 'Run test day')
                }
              </Button>
            )}
          </div>
        </div>
      </div>

      <BossDecisionModal />
    </div>
  );
};

export default BusinessSimulator;

export type { UIState as SimulatorState } from '@/lib/demoStore';
