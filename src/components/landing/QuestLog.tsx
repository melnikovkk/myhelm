import { useLanguage } from '@/hooks/useLanguage';
import { Check, Circle, Target, Rocket, Brain, Award } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import type { UIState, DecisionType } from '@/lib/demoStore';

interface Quest {
  id: string;
  titleEn: string;
  titleRu: string;
  descEn: string;
  descRu: string;
  icon: React.ElementType;
  isComplete: (uiState: UIState, decisionMade: DecisionType | null) => boolean;
  isActive: (uiState: UIState) => boolean;
}

const QUESTS: Quest[] = [
  {
    id: 'launch',
    titleEn: 'Launch business blueprint',
    titleRu: 'Запустить бизнес-план',
    descEn: 'AI generates your business structure',
    descRu: 'AI генерирует структуру бизнеса',
    icon: Rocket,
    isComplete: (uiState) => ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(uiState),
    isActive: (uiState) => uiState === 'ARTIFACTS',
  },
  {
    id: 'decision',
    titleEn: 'Handle CEO decision',
    titleRu: 'Принять решение CEO',
    descEn: 'Make a real business decision',
    descRu: 'Примите реальное бизнес-решение',
    icon: Brain,
    isComplete: (uiState, decisionMade) => decisionMade !== null && ['DECIDED', 'EVIDENCE', 'REPLAY'].includes(uiState),
    isActive: (uiState) => uiState === 'DECISION',
  },
  {
    id: 'evidence',
    titleEn: 'Collect proof trophies',
    titleRu: 'Собрать трофеи-доказательства',
    descEn: 'Every action produces proof',
    descRu: 'Каждое действие создаёт доказательство',
    icon: Award,
    isComplete: (uiState) => uiState === 'REPLAY',
    isActive: (uiState) => uiState === 'EVIDENCE',
  },
];

const QuestLog = () => {
  const { language } = useLanguage();
  const { state } = useDemo();
  
  const { uiState, timeline } = state;
  const { decisionMade } = timeline;
  
  const completedCount = QUESTS.filter(q => q.isComplete(uiState, decisionMade)).length;
  const showLog = ['ARTIFACTS', 'RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(uiState);

  if (!showLog) return null;

  return (
    <div className="hud-panel">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-accent" />
        <h4 className="text-sm font-semibold text-foreground">
          {language === 'ru' ? 'Задачи дня' : "Today's Objectives"}
        </h4>
        <span className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary">
          {completedCount}/{QUESTS.length}
        </span>
      </div>

      <div className="space-y-2">
        {QUESTS.map((quest, index) => {
          const completed = quest.isComplete(uiState, decisionMade);
          const active = quest.isActive(uiState);
          const Icon = quest.icon;

          return (
            <div
              key={quest.id}
              className={`relative flex items-start gap-3 p-2 rounded-lg transition-all duration-300 ${
                completed ? 'bg-success/5' : 
                active ? 'bg-primary/10 border border-primary/30' : 
                'opacity-60'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                completed ? 'bg-success/20' : 
                active ? 'bg-primary/20' : 
                'bg-muted'
              }`}>
                {completed ? (
                  <Check className="w-3.5 h-3.5 text-success quest-check" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm block ${
                  completed ? 'text-success line-through' : 
                  active ? 'text-foreground font-medium' : 
                  'text-muted-foreground'
                }`}>
                  {language === 'ru' ? quest.titleRu : quest.titleEn}
                </span>
                {active && (
                  <span className="text-xs text-muted-foreground mt-0.5 block animate-fade-in">
                    {language === 'ru' ? quest.descRu : quest.descEn}
                  </span>
                )}
              </div>

              {/* Active indicator */}
              {active && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestLog;