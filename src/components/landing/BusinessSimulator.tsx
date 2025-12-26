import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, RotateCcw, Loader2, Globe, Sparkles, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BusinessTab from './BusinessTab';
import RealityTab from './RealityTab';
import CoverageTab from './CoverageTab';
import RegionTab from './RegionTab';
import BossDecisionModal from './BossDecisionModal';
import { RegionConfig, IndustryConfig } from '@/lib/regionData';

/*
 * DEMO HAPPY PATH CHECKLIST:
 * 1. ✓ Prompt generated via wizard OR canon fallback
 * 2. ✓ Click "Launch" → LAUNCHING state → AI generates artifacts
 * 3. ✓ ARTIFACTS revealed with business data
 * 4. ✓ Click "Run test day" → timeline animates
 * 5. ✓ At 15:30 → DECISION state → modal appears, timeline PAUSES
 * 6. ✓ Make decision → timeline RESUMES
 * 7. ✓ At 100% → EVIDENCE trophies appear
 * 8. ✓ REPLAY mode → scrubber works, can run again
 * 9. ✓ "Edit prompt" returns to TYPED keeping prompt text
 */

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
  // Digitize-specific fields
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

  // Loading state
  if (state === 'LAUNCHING' || isGenerating) {
    return (
      <div className="mt-8 animate-fade-in">
        <div className="glass-card p-6 md:p-8">
          <div className="w-full grid grid-cols-4 bg-secondary/30 rounded-xl p-1 mb-6">
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-secondary/20 border border-border/30 space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/20 border border-border/30 space-y-3">
              <Skeleton className="h-5 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {mode === 'digitize' 
                ? (language === 'ru' ? 'Создаём план миграции...' : 'Creating migration plan...')
                : (language === 'ru' ? 'Создаём ваш бизнес...' : 'Building your business...')
              }
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md text-center">
              {mode === 'digitize'
                ? (language === 'ru' 
                    ? 'AI анализирует ваш бизнес и генерирует план оцифровки с автоматизациями'
                    : 'AI is analyzing your business and generating a digitization plan with automations')
                : (language === 'ru' 
                    ? 'AI анализирует промпт и генерирует план, структуру и операционную систему'
                    : 'AI is analyzing your prompt and generating the plan, structure, and operating system')
              }
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <Skeleton className="h-10 w-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!businessData) return null;

  const canRunTestDay = state === 'ARTIFACTS' || state === 'REPLAY';

  return (
    <div className="mt-8 animate-fade-in-up">
      {/* Digitize mode badge */}
      {businessData.isDigitize && (
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ru' ? 'Режим оцифровки' : 'Digitization Mode'}
          </div>
        </div>
      )}

      {/* Tabs - now with 4 tabs including Reality */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-secondary/50 rounded-xl p-1 mb-6">
          <TabsTrigger 
            value="business" 
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-xs sm:text-sm"
          >
            {t('tab.business')}
          </TabsTrigger>
          <TabsTrigger 
            value="reality"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-xs sm:text-sm"
          >
            <Globe className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            {language === 'ru' ? 'Реальность' : 'Reality'}
          </TabsTrigger>
          <TabsTrigger 
            value="region"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-xs sm:text-sm"
          >
            {t('tab.region')}
          </TabsTrigger>
          <TabsTrigger 
            value="coverage"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all text-xs sm:text-sm"
          >
            {t('tab.coverage')}
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

        <TabsContent value="reality" className="mt-0">
          <RealityTab prompt={prompt} region={region} industry={industry} />
        </TabsContent>

        <TabsContent value="region" className="mt-0">
          <RegionTab prompt={prompt} region={region || null} industry={industry || null} />
        </TabsContent>

        <TabsContent value="coverage" className="mt-0">
          <CoverageTab />
        </TabsContent>
      </Tabs>

      {/* Test Day / Replay Controls */}
      {activeTab === 'business' && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {canRunTestDay && (
            <Button
              onClick={handleRunTestDay}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 h-12 text-base font-semibold shadow-lg shadow-primary/25"
            >
              <Play className="w-5 h-5" />
              {state === 'REPLAY' 
                ? (language === 'ru' ? 'Запустить снова' : 'Run again') 
                : (language === 'ru' ? 'Запустить тестовый день' : 'Run a test day')
              }
            </Button>
          )}
          
          {state === 'REPLAY' && (
            <Button
              variant="outline"
              onClick={onEditPrompt}
              className="gap-2 rounded-xl h-12"
            >
              <RotateCcw className="w-4 h-4" />
              {t('replay.edit')}
            </Button>
          )}
        </div>
      )}

      {/* Boss Decision Modal */}
      <BossDecisionModal 
        open={showDecisionModal}
        onDecision={handleDecision}
      />
    </div>
  );
};

export default BusinessSimulator;
