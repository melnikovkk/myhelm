import { useLanguage } from '@/hooks/useLanguage';
import { Clock } from 'lucide-react';
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
  
  if (!showHUD) return null;

  // Calculate current time based on progress
  const getCurrentTime = () => {
    const hours = 9 + (timelineProgress / 100) * 8; // 9:00 to 17:00
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-4 mb-6 animate-fade-in">
      {/* HUD Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-semibold text-foreground">
            {isReplay 
              ? (language === 'ru' ? 'Режим воспроизведения' : 'Replay Mode')
              : (language === 'ru' ? 'Тестовый день • Активен' : 'Test Day • Active')
            }
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm">{getCurrentTime()}</span>
        </div>
      </div>

      {/* Progress Bar with shimmer */}
      <div className="relative mb-6">
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-linear relative"
            style={{ width: `${timelineProgress}%` }}
          >
            {state === 'RUNNING' && (
              <div className="absolute inset-0 progress-shimmer" />
            )}
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">09:00</span>
          <span className="text-xs font-mono text-primary">{Math.round(timelineProgress)}%</span>
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
