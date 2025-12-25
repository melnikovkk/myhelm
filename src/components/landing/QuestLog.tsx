import { useLanguage } from '@/hooks/useLanguage';
import { Check, Circle, Target } from 'lucide-react';
import type { SimulatorState } from './BusinessSimulator';

interface QuestLogProps {
  state: SimulatorState;
  decisionMade: 'approve' | 'deny' | 'photo' | null;
}

interface Quest {
  id: string;
  titleEn: string;
  titleRu: string;
  isComplete: (state: SimulatorState, decisionMade: 'approve' | 'deny' | 'photo' | null) => boolean;
  isActive: (state: SimulatorState) => boolean;
}

const QUESTS: Quest[] = [
  {
    id: 'launch',
    titleEn: 'Launch business blueprint',
    titleRu: 'Запустить бизнес-план',
    isComplete: (state) => ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state),
    isActive: (state) => state === 'ARTIFACTS',
  },
  {
    id: 'decision',
    titleEn: 'Handle CEO decision',
    titleRu: 'Принять решение CEO',
    isComplete: (state, decisionMade) => decisionMade !== null && ['DECIDED', 'EVIDENCE', 'REPLAY'].includes(state),
    isActive: (state) => state === 'DECISION',
  },
  {
    id: 'evidence',
    titleEn: 'Collect proof trophies',
    titleRu: 'Собрать трофеи-доказательства',
    isComplete: (state) => state === 'REPLAY',
    isActive: (state) => state === 'EVIDENCE',
  },
];

const QuestLog = ({ state, decisionMade }: QuestLogProps) => {
  const { language } = useLanguage();
  
  const completedCount = QUESTS.filter(q => q.isComplete(state, decisionMade)).length;
  const showLog = ['ARTIFACTS', 'RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state);

  if (!showLog) return null;

  return (
    <div className="hud-panel">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-accent" />
        <h4 className="text-sm font-semibold text-foreground">
          {language === 'ru' ? 'Задачи дня' : "Today's Objectives"}
        </h4>
        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {completedCount}/{QUESTS.length}
        </span>
      </div>

      <div className="space-y-1">
        {QUESTS.map((quest) => {
          const completed = quest.isComplete(state, decisionMade);
          const active = quest.isActive(state);

          return (
            <div
              key={quest.id}
              className={`quest-item ${completed ? 'completed' : ''} ${active ? 'active' : ''}`}
            >
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-background flex items-center justify-center">
                {completed ? (
                  <Check className="w-3 h-3 text-success quest-check" />
                ) : active ? (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                ) : (
                  <Circle className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              
              <span className={`text-sm ${
                completed ? 'text-muted-foreground line-through' : 
                active ? 'text-foreground font-medium' : 
                'text-muted-foreground'
              }`}>
                {language === 'ru' ? quest.titleRu : quest.titleEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestLog;
