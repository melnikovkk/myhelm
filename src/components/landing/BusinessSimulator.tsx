import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Loader2, Sparkles, Building2, BarChart3, Pencil } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BusinessTab from './BusinessTab';
import RealityTab from './RealityTab';
import CoverageTab from './CoverageTab';
import BossDecisionModal from './BossDecisionModal';
import { RegionConfig, IndustryConfig } from '@/lib/regionData';

export type SimulatorState = 
  | 'EMPTY'
  | 'TYPED'
  | 'LAUNCHING'
  | 'ARTIFACTS'
  | 'RUNNING'
  | 'DECISION'
  | 'DECIDED'
  | 'EVIDENCE'
  | 'REPLAY';

export interface BusinessData {
  name: string;
  tagline?: string;
  packages: { name: string; price: string; description?: string }[];
  target: string;
  channel: string;
  week1Goals?: string[];
  week1?: string[];
  roles: string[];
  loops: {
    sell: string;
    deliver: string;
    money: string;
    support: string;
  };
  policies: string[];
  kpis?: string[];
  isDigitize?: boolean;
  migrationPlan?: string[];
  automations?: string[];
  beforeAfter?: { before: string; after: string }[];
}

interface BusinessSimulatorProps {
  state: SimulatorState;
  setState: (state: SimulatorState) => void;
  prompt: string;
  onEditPrompt: () => void;
  region?: RegionConfig | null;
  industry?: IndustryConfig | null;
  mode?: 'zero' | 'digitize';
}

interface TimelineEvent {
  time: string;
  key: string;
  progress: number;
  isBossDecision?: boolean;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  { time: '09:00', key: 'timeline.09:00', progress: 0 },
  { time: '10:00', key: 'timeline.10:00', progress: 12.5 },
  { time: '12:00', key: 'timeline.12:00', progress: 37.5 },
  { time: '14:00', key: 'timeline.14:00', progress: 62.5 },
  { time: '15:00', key: 'timeline.15:00', progress: 75 },
  { time: '15:30', key: 'timeline.15:30', progress: 81.25, isBossDecision: true },
  { time: '16:00', key: 'timeline.16:00', progress: 87.5 },
  { time: '17:00', key: 'timeline.17:00', progress: 100 },
];

const BusinessSimulator = ({ state, setState, prompt, onEditPrompt, region, industry, mode = 'zero' }: BusinessSimulatorProps) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('business');
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(-1);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionMade, setDecisionMade] = useState<'approve' | 'deny' | 'photo' | null>(null);
  const [evidenceRevealed, setEvidenceRevealed] = useState<number[]>([]);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const timelineIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state === 'LAUNCHING' && !businessData && !isGenerating) {
      generateArtifacts();
    }
  }, [state]);

  const generateArtifacts = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-artifacts', {
        body: { 
          prompt, 
          locale: language,
          mode,
          regionCode: region?.code,
          currency: region?.currency,
          industryKey: industry?.key,
        },
      });

      if (error) throw error;

      if (data?.success && data?.artifacts) {
        const artifacts = data.artifacts;
        setBusinessData({
          name: artifacts.name || 'New Business',
          tagline: artifacts.tagline,
          packages: artifacts.packages || [],
          target: artifacts.target || '',
          channel: artifacts.channel || 'WhatsApp',
          week1Goals: artifacts.week1Goals,
          week1: artifacts.week1Goals || artifacts.week1,
          roles: artifacts.roles || [],
          loops: artifacts.loops || { sell: '', deliver: '', money: '', support: '' },
          policies: artifacts.policies || [],
          kpis: artifacts.kpis,
          isDigitize: mode === 'digitize',
          migrationPlan: artifacts.migrationPlan,
          automations: artifacts.automations,
          beforeAfter: artifacts.beforeAfter,
        });
        setState('ARTIFACTS');
      } else {
        throw new Error(data?.error || 'Failed to generate artifacts');
      }
    } catch (err) {
      console.error('Artifact generation error:', err);
      toast.error(language === 'ru' ? 'Ошибка генерации. Попробуйте снова.' : 'Generation failed. Please try again.');
      setState('TYPED');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (timelineIntervalRef.current) {
      clearInterval(timelineIntervalRef.current);
      timelineIntervalRef.current = null;
    }
    
    if (state !== 'RUNNING') return;

    timelineIntervalRef.current = setInterval(() => {
      setTimelineProgress(prev => {
        const next = prev + 0.5;
        
        const eventIndex = TIMELINE_EVENTS.findIndex(e => e.progress > next) - 1;
        if (eventIndex !== currentEventIndex && eventIndex >= 0) {
          setCurrentEventIndex(eventIndex);
          
          const currentEvent = TIMELINE_EVENTS[eventIndex];
          if (currentEvent?.isBossDecision && !decisionMade) {
            if (timelineIntervalRef.current) {
              clearInterval(timelineIntervalRef.current);
              timelineIntervalRef.current = null;
            }
            setState('DECISION');
            setShowDecisionModal(true);
            return prev;
          }
        }
        
        if (next >= 100) {
          if (timelineIntervalRef.current) {
            clearInterval(timelineIntervalRef.current);
            timelineIntervalRef.current = null;
          }
          setState('EVIDENCE');
          return 100;
        }
        
        return next;
      });
    }, 100);

    return () => {
      if (timelineIntervalRef.current) {
        clearInterval(timelineIntervalRef.current);
        timelineIntervalRef.current = null;
      }
    };
  }, [state, currentEventIndex, setState, decisionMade]);

  useEffect(() => {
    if (state !== 'EVIDENCE') return;
    
    const timers = [0, 1, 2].map((i) => 
      setTimeout(() => {
        setEvidenceRevealed(prev => [...prev, i]);
      }, i * 400)
    );

    const replayTimer = setTimeout(() => {
      setState('REPLAY');
    }, 2000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(replayTimer);
    };
  }, [state, setState]);

  const handleRunTestDay = useCallback(() => {
    if (state !== 'ARTIFACTS' && state !== 'REPLAY') return;
    setTimelineProgress(0);
    setCurrentEventIndex(-1);
    setDecisionMade(null);
    setEvidenceRevealed([]);
    setState('RUNNING');
  }, [state, setState]);

  const handleDecision = useCallback((decision: 'approve' | 'deny' | 'photo') => {
    setDecisionMade(decision);
    setShowDecisionModal(false);
    setState('DECIDED');
    
    setTimeout(() => {
      setState('RUNNING');
    }, 500);
  }, [setState]);

  const handleScrub = useCallback((progress: number) => {
    if (state !== 'REPLAY') return;
    setTimelineProgress(progress);
    const eventIndex = TIMELINE_EVENTS.findIndex(e => e.progress > progress) - 1;
    setCurrentEventIndex(Math.max(0, eventIndex));
    
    const newEvidence: number[] = [];
    if (progress >= 87.5) newEvidence.push(0);
    if (progress >= 93) newEvidence.push(1);
    if (progress >= 100) newEvidence.push(2);
    setEvidenceRevealed(newEvidence);
  }, [state]);

  // Loading state - cleaner, more focused
  if (state === 'LAUNCHING' || isGenerating) {
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
              {mode === 'digitize' 
                ? (language === 'ru' ? 'Создаём план оцифровки' : 'Creating digitization plan')
                : (language === 'ru' ? 'Создаём ваш бизнес' : 'Building your business')
              }
            </h3>
            
            {/* Show context */}
            {(region || industry) && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {industry && (
                  <span className="px-2.5 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                    {language === 'ru' ? industry.labelRu : industry.labelEn}
                  </span>
                )}
                {region && (
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {language === 'ru' ? region.nameRu : region.nameEn}
                  </span>
                )}
              </div>
            )}
            
            <p className="mt-3 text-muted-foreground text-center max-w-sm text-sm">
              {language === 'ru' 
                ? 'AI генерирует структуру, процессы и операционную систему'
                : 'AI is generating structure, processes, and operating system'}
            </p>

            {/* Progress steps */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  {language === 'ru' ? 'Анализ' : 'Analysis'}
                </span>
              </div>
              <div className="w-8 h-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-border" />
                <span className="text-xs text-muted-foreground">
                  {language === 'ru' ? 'Структура' : 'Structure'}
                </span>
              </div>
              <div className="w-8 h-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-border" />
                <span className="text-xs text-muted-foreground">
                  {language === 'ru' ? 'Готово' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!businessData) return null;

  const canRunTestDay = state === 'ARTIFACTS' || state === 'REPLAY';
  const isRunning = ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE'].includes(state);

  return (
    <div className="mt-8 animate-fade-in-up">
      {/* Header with business name and mode badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{businessData.name}</h2>
            {businessData.tagline && (
              <p className="text-xs text-muted-foreground">{businessData.tagline}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {businessData.isDigitize && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              {language === 'ru' ? 'Оцифровка' : 'Digitize'}
            </span>
          )}
          {region && (
            <span className="px-2 py-1 bg-secondary text-foreground text-xs font-medium rounded">
              {region.currencySymbol}
            </span>
          )}
        </div>
      </div>

      {/* Simplified Tabs - Just 2 main views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 bg-secondary/50 rounded-xl p-1 mb-6">
          <TabsTrigger 
            value="business" 
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-sm gap-2"
          >
            <Building2 className="w-4 h-4" />
            {language === 'ru' ? 'Бизнес' : 'Business'}
          </TabsTrigger>
          <TabsTrigger 
            value="insights"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-sm gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {language === 'ru' ? 'Инсайты' : 'Insights'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-0">
          <BusinessTab 
            data={businessData}
            state={state}
            timelineProgress={timelineProgress}
            currentEventIndex={currentEventIndex}
            decisionMade={decisionMade}
            evidenceRevealed={evidenceRevealed}
            onScrub={handleScrub}
            region={region}
            industry={industry}
          />
        </TabsContent>

        <TabsContent value="insights" className="mt-0 space-y-4">
          <RealityTab prompt={prompt} region={region} industry={industry} />
          <CoverageTab />
        </TabsContent>
      </Tabs>

      {/* Action Bar - Fixed at bottom of simulator */}
      <div className="mt-6 p-4 bg-secondary/30 rounded-xl border border-border/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: State indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-success animate-pulse' : 
              state === 'REPLAY' ? 'bg-accent' : 
              'bg-primary'
            }`} />
            <span className="text-sm text-muted-foreground">
              {state === 'ARTIFACTS' && (language === 'ru' ? 'Готов к запуску' : 'Ready to run')}
              {isRunning && (language === 'ru' ? 'Тестовый день...' : 'Running test day...')}
              {state === 'REPLAY' && (language === 'ru' ? 'Завершено' : 'Complete')}
            </span>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-3">
            {state === 'REPLAY' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditPrompt}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-4 h-4" />
                {language === 'ru' ? 'Изменить' : 'Edit'}
              </Button>
            )}
            
            {canRunTestDay && (
              <Button
                onClick={handleRunTestDay}
                size="sm"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20"
              >
                <Play className="w-4 h-4" />
                {state === 'REPLAY' 
                  ? (language === 'ru' ? 'Заново' : 'Run again') 
                  : (language === 'ru' ? 'Запустить день' : 'Run test day')
                }
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Boss Decision Modal */}
      <BossDecisionModal 
        open={showDecisionModal}
        onDecision={handleDecision}
      />
    </div>
  );
};

export default BusinessSimulator;