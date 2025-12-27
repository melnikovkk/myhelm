import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Building2, Globe, Layers, Pencil } from 'lucide-react';
import BusinessTab from './BusinessTab';
import RegionTab from './RegionTab';
import CoverageTab from './CoverageTab';
import BossDecisionModal from './BossDecisionModal';
import { useState } from 'react';

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
      <div className="mt-8 animate-fade-in">
        <div className="glass-card p-8 md:p-12">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <div className="absolute -inset-2 rounded-3xl bg-primary/10 animate-pulse" />
            </div>
            
            <h3 className="text-xl font-bold text-foreground text-center">
              {state.mode === 'digitize' 
                ? (language === 'ru' ? 'Создаём план оцифровки' : 'Creating digitization plan')
                : (language === 'ru' ? 'Создаём ваш бизнес' : 'Building your business')
              }
            </h3>
            
            {(state.region || state.industry) && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {state.industry && (
                  <span className="px-2.5 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                    {language === 'ru' ? state.industry.labelRu : state.industry.labelEn}
                  </span>
                )}
                {state.region && (
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {language === 'ru' ? state.region.nameRu : state.region.nameEn}
                  </span>
                )}
              </div>
            )}
            
            <p className="mt-3 text-muted-foreground text-center max-w-sm text-sm">
              {language === 'ru' 
                ? 'AI генерирует структуру, процессы и операционную систему'
                : 'AI is generating structure, processes, and operating system'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!state.business) return null;

  return (
    <div className="mt-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{state.business.name}</h2>
            {state.business.tagline && (
              <p className="text-xs text-muted-foreground">{state.business.tagline}</p>
            )}
          </div>
        </div>
        {state.region && (
          <span className="px-2 py-1 bg-secondary text-foreground text-xs font-medium rounded">
            {state.region.currencySymbol}
          </span>
        )}
      </div>

      {/* Tabs: Business / Region / Coverage */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-secondary/50 rounded-xl p-1 mb-6">
          <TabsTrigger value="business" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-sm gap-2">
            <Building2 className="w-4 h-4" />
            {t('tab.business')}
          </TabsTrigger>
          <TabsTrigger value="region" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-sm gap-2">
            <Globe className="w-4 h-4" />
            {t('tab.region')}
          </TabsTrigger>
          <TabsTrigger value="coverage" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-sm gap-2">
            <Layers className="w-4 h-4" />
            {t('tab.coverage')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-0">
          <BusinessTab />
        </TabsContent>

        <TabsContent value="region" className="mt-0">
          <RegionTab prompt={state.prompt} region={state.region} industry={state.industry} />
        </TabsContent>

        <TabsContent value="coverage" className="mt-0">
          <CoverageTab />
        </TabsContent>
      </Tabs>

      {/* Action Bar */}
      <div className="mt-6 p-4 bg-secondary/30 rounded-xl border border-border/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-success animate-pulse' : 
              isReplay ? 'bg-accent' : 
              'bg-primary'
            }`} />
            <span className="text-sm text-muted-foreground">
              {state.uiState === 'ARTIFACTS' && (language === 'ru' ? 'Готов к запуску' : 'Ready to run')}
              {isRunning && (language === 'ru' ? 'Тестовый день...' : 'Running test day...')}
              {isReplay && (language === 'ru' ? 'Завершено' : 'Complete')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isReplay && (
              <Button variant="ghost" size="sm" onClick={actions.requestEdit} className="gap-2 text-muted-foreground hover:text-foreground">
                <Pencil className="w-4 h-4" />
                {language === 'ru' ? 'Изменить' : 'Edit'}
              </Button>
            )}
            
            {canRunTestDay && (
              <Button onClick={actions.startTestDay} size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20">
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

      {/* Boss Decision Modal */}
      <BossDecisionModal />
    </div>
  );
};

export default BusinessSimulator;

// Export type for backwards compatibility
export type { UIState as SimulatorState } from '@/lib/demoStore';
