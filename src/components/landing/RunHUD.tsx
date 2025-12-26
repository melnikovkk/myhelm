import { useLanguage } from '@/hooks/useLanguage';
import { Clock, Trophy, Sparkles, PartyPopper } from 'lucide-react';
import type { SimulatorState } from './BusinessSimulator';
import QuestLog from './QuestLog';
import CeoAttention from './CeoAttention';
import MiniMap from './MiniMap';

interface RunHUDProps {
  state: SimulatorState;
  timelineProgress: number;
  currentEventIndex: number;
  decisionMade: 'approve' | 'deny' | 'photo' | null;
  isReplay?: boolean;
}

const RunHUD = ({ 
  state, 
  timelineProgress, 
  currentEventIndex, 
  decisionMade,
  isReplay 
}: RunHUDProps) => {
  const { language } = useLanguage();
  
  const showHUD = ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state);
  const isDayComplete = state === 'EVIDENCE' || state === 'REPLAY';
  
  if (!showHUD) return null;

  // Calculate current time based on progress
  const getCurrentTime = () => {
    const hours = 9 + (timelineProgress / 100) * 8; // 9:00 to 17:00
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`glass-card p-4 mb-6 animate-fade-in ${isDayComplete ? 'border-success/30' : ''}`}>
      {/* Day Complete Celebration Banner */}
      {isDayComplete && (
        <div className="day-complete mb-4 p-3 bg-success/10 border border-success/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-success" />
            </div>
            <div>
              <h4 className="font-semibold text-success text-sm">
                {language === 'ru' ? 'Тестовый день завершён!' : 'Test Day Complete!'}
              </h4>
              <p className="text-xs text-success/80">
                {language === 'ru' ? 'Все задачи выполнены' : 'All objectives achieved'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PartyPopper className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-mono text-success bg-success/10 px-2 py-1 rounded">
              3/3
            </span>
          </div>
        </div>
      )}

      {/* HUD Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            state === 'DECISION' ? 'bg-accent animate-pulse' : 
            isDayComplete ? 'bg-success' : 
            'bg-success animate-pulse'
          }`} />
          <span className="text-sm font-semibold text-foreground">
            {isReplay 
              ? (language === 'ru' ? 'Режим воспроизведения' : 'Replay Mode')
              : isDayComplete
              ? (language === 'ru' ? 'День завершён' : 'Day Complete')
              : state === 'DECISION'
              ? (language === 'ru' ? 'Ожидание решения' : 'Awaiting Decision')
              : (language === 'ru' ? 'Тестовый день • Активен' : 'Test Day • Active')
            }
          </span>
          {state === 'DECISION' && (
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className={`font-mono text-sm ${state === 'DECISION' ? 'text-accent font-bold' : ''}`}>
            {getCurrentTime()}
          </span>
        </div>
      </div>

      {/* Progress Bar with enhanced visuals */}
      <div className="relative mb-6">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear relative ${
              isDayComplete 
                ? 'bg-gradient-to-r from-success to-success/70' 
                : 'bg-gradient-to-r from-primary to-primary/70'
            }`}
            style={{ width: `${timelineProgress}%` }}
          >
            {state === 'RUNNING' && (
              <div className="absolute inset-0 progress-shimmer" />
            )}
          </div>
        </div>
        
        {/* Timeline scanner indicator */}
        {state === 'RUNNING' && (
          <div 
            className="timeline-scanner h-4 -top-1"
            style={{ left: `${timelineProgress}%` }}
          />
        )}
        
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">09:00</span>
          <span className={`text-xs font-mono ${isDayComplete ? 'text-success font-semibold' : 'text-primary'}`}>
            {Math.round(timelineProgress)}%
          </span>
          <span className="text-xs text-muted-foreground">17:00</span>
        </div>
      </div>

      {/* Three-column HUD layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Quest Log */}
        <QuestLog state={state} decisionMade={decisionMade} />

        {/* Center: CEO Attention */}
        <CeoAttention state={state} decisionMade={decisionMade} />

        {/* Right: Mini-map */}
        <MiniMap />
      </div>
    </div>
  );
};

export default RunHUD;
