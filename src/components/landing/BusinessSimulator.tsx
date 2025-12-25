import { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import BusinessTab from './BusinessTab';
import RealityTab from './RealityTab';
import CoverageTab from './CoverageTab';
import BossDecisionModal from './BossDecisionModal';

// Demo state machine states
export type SimulatorState = 
  | 'EMPTY'       // 0: prompt empty
  | 'TYPED'       // 1: >=10 chars
  | 'LAUNCHING'   // 2: compiling
  | 'ARTIFACTS'   // 3: revealed
  | 'RUNNING'     // 4: test day
  | 'DECISION'    // 5: boss decision
  | 'DECIDED'     // 6: decision made
  | 'EVIDENCE'    // 7: trophies
  | 'REPLAY';     // 8: scrubber active

export interface BusinessData {
  name: string;
  packages: { name: string; price: string }[];
  target: string;
  channel: string;
  week1: string[];
  roles: string[];
  loops: {
    sell: string;
    deliver: string;
    money: string;
    support: string;
  };
  policies: string[];
}

interface BusinessSimulatorProps {
  state: SimulatorState;
  setState: (state: SimulatorState) => void;
  prompt: string;
  onEditPrompt: () => void;
}

// Timeline events with times
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

// Generate smart business data from prompt (or use canon fallback)
function generateBusinessData(prompt: string, language: 'en' | 'ru'): BusinessData {
  // Extract potential business name from prompt
  const words = prompt.toLowerCase();
  let businessType = 'cleaning';
  let city = 'Berlin';
  
  if (words.includes('клининг') || words.includes('уборк') || words.includes('cleaning')) {
    businessType = 'cleaning';
  } else if (words.includes('консалтинг') || words.includes('consulting')) {
    businessType = 'consulting';
  } else if (words.includes('коучинг') || words.includes('coaching')) {
    businessType = 'coaching';
  }
  
  if (words.includes('берлин') || words.includes('berlin')) {
    city = 'Berlin';
  } else if (words.includes('москв') || words.includes('moscow')) {
    city = language === 'ru' ? 'Москва' : 'Moscow';
  }

  const isRu = language === 'ru';
  
  // Canon demo data
  return {
    name: isRu ? `CleanPro ${city}` : `CleanPro ${city}`,
    packages: [
      { name: isRu ? 'Базовый' : 'Basic', price: '€49' },
      { name: isRu ? 'Глубокий' : 'Deep', price: '€89' },
      { name: isRu ? 'Офис' : 'Office', price: '€149' },
    ],
    target: isRu 
      ? 'Занятые профессионалы, семьи, малый бизнес' 
      : 'Busy professionals, families, small businesses',
    channel: 'WhatsApp',
    week1: isRu 
      ? ['Запустить WhatsApp Business', 'Первые 5 клиентов', 'Нанять 2 уборщиков']
      : ['Launch WhatsApp Business', 'First 5 customers', 'Hire 2 cleaners'],
    roles: isRu 
      ? ['CEO (ты)', 'Уборщики', 'Поддержка (HELM)']
      : ['CEO (you)', 'Cleaners', 'Support (HELM)'],
    loops: {
      sell: isRu ? 'Лид → Бронь → Подтверждение' : 'Lead → Booking → Confirmation',
      deliver: isRu ? 'Назначение → Выполнение → Проверка' : 'Assignment → Completion → Verification',
      money: isRu ? 'Счёт → Оплата → Сверка' : 'Invoice → Payment → Reconciliation',
      support: isRu ? 'Запрос → Решение CEO → Запись' : 'Request → CEO Decision → Record',
    },
    policies: isRu 
      ? ['Возврат = решение CEO', 'Скидка <10% = авто', 'Перенос = бесплатно']
      : ['Refund = CEO decision', 'Discount <10% = auto', 'Reschedule = free'],
  };
}

const BusinessSimulator = ({ state, setState, prompt, onEditPrompt }: BusinessSimulatorProps) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('business');
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(-1);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionMade, setDecisionMade] = useState<'approve' | 'deny' | 'photo' | null>(null);
  const [evidenceRevealed, setEvidenceRevealed] = useState<number[]>([]);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);

  // Generate business data when entering ARTIFACTS state
  useEffect(() => {
    if (state === 'ARTIFACTS' && !businessData) {
      setBusinessData(generateBusinessData(prompt, language));
    }
  }, [state, prompt, language, businessData]);

  // Timeline animation
  useEffect(() => {
    if (state !== 'RUNNING') return;

    const interval = setInterval(() => {
      setTimelineProgress(prev => {
        const next = prev + 0.5;
        
        // Find current event
        const eventIndex = TIMELINE_EVENTS.findIndex(e => e.progress > next) - 1;
        if (eventIndex !== currentEventIndex && eventIndex >= 0) {
          setCurrentEventIndex(eventIndex);
          
          // Check for boss decision event
          const currentEvent = TIMELINE_EVENTS[eventIndex];
          if (currentEvent?.isBossDecision) {
            setState('DECISION');
            setShowDecisionModal(true);
            return prev; // Pause progress
          }
        }
        
        // Complete
        if (next >= 100) {
          setState('EVIDENCE');
          clearInterval(interval);
          return 100;
        }
        
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [state, currentEventIndex, setState]);

  // Reveal evidence trophies
  useEffect(() => {
    if (state !== 'EVIDENCE') return;
    
    const timers = [0, 1, 2].map((i) => 
      setTimeout(() => {
        setEvidenceRevealed(prev => [...prev, i]);
      }, i * 400)
    );

    // Transition to REPLAY after evidence
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
    
    // Resume timeline after short delay
    setTimeout(() => {
      setState('RUNNING');
    }, 500);
  }, [setState]);

  const handleScrub = useCallback((progress: number) => {
    if (state !== 'REPLAY') return;
    setTimelineProgress(progress);
    const eventIndex = TIMELINE_EVENTS.findIndex(e => e.progress > progress) - 1;
    setCurrentEventIndex(Math.max(0, eventIndex));
  }, [state]);

  if (!businessData) return null;

  const canRunTestDay = state === 'ARTIFACTS' || state === 'REPLAY';
  const showTimeline = ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state);

  return (
    <div className="mt-8 animate-fade-in-up">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-secondary/50 mb-6">
          <TabsTrigger 
            value="business" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {t('tab.business')}
          </TabsTrigger>
          <TabsTrigger 
            value="reality"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {t('tab.reality')}
          </TabsTrigger>
          <TabsTrigger 
            value="coverage"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
          />
        </TabsContent>

        <TabsContent value="reality" className="mt-0">
          <RealityTab prompt={prompt} />
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
              className="gap-2 bg-primary text-primary-foreground btn-glow"
            >
              <Play className="w-4 h-4" />
              {state === 'REPLAY' ? (language === 'ru' ? 'Запустить снова' : 'Run again') : t('timeline.run')}
            </Button>
          )}
          
          {state === 'REPLAY' && (
            <Button
              variant="outline"
              onClick={onEditPrompt}
              className="gap-2"
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
