import { useLanguage } from '@/hooks/useLanguage';
import { Clock, Trophy, Sparkles, PartyPopper, Activity } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import QuestLog from './QuestLog';
import CeoAttention from './CeoAttention';
import MiniMap from './MiniMap';

// Timeline events for visual feedback
const TIMELINE_EVENTS = [
  { progress: 12.5, keyEn: 'New lead captured', keyRu: 'Новый лид захвачен', domain: 'sell' },
  { progress: 37.5, keyEn: 'Service scheduled', keyRu: 'Услуга запланирована', domain: 'deliver' },
  { progress: 62.5, keyEn: 'Invoice sent', keyRu: 'Счёт отправлен', domain: 'money' },
  { progress: 75, keyEn: 'Payment received', keyRu: 'Платёж получен', domain: 'money' },
  { progress: 81.25, keyEn: 'CEO decision required', keyRu: 'Требуется решение CEO', domain: 'support', isDecision: true },
  { progress: 87.5, keyEn: 'Feedback collected', keyRu: 'Отзыв собран', domain: 'support' },
  { progress: 100, keyEn: 'Day complete', keyRu: 'День завершён', domain: 'reporting' },
];

const RunHUD = () => {
  const { language } = useLanguage();
  const { state, isReplay, isDayComplete } = useDemo();
  
  const { uiState, timeline } = state;
  const { progress: timelineProgress, decisionMade, currentEventIndex } = timeline;
  
  const showHUD = ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(uiState);
  
  if (!showHUD) return null;

  // Calculate current time based on progress
  const getCurrentTime = () => {
    const hours = 9 + (timelineProgress / 100) * 8; // 9:00 to 17:00
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Get current event for live feed
  const getCurrentEvent = () => {
    for (let i = TIMELINE_EVENTS.length - 1; i >= 0; i--) {
      if (timelineProgress >= TIMELINE_EVENTS[i].progress) {
        return TIMELINE_EVENTS[i];
      }
    }
    return null;
  };

  const currentEvent = getCurrentEvent();
  const activeDomain = currentEvent?.domain || 'sell';

  return (
    <div className={`glass-card p-4 mb-6 animate-fade-in ${isDayComplete ? 'border-success/30' : uiState === 'DECISION' ? 'border-accent/50 boss-pulse' : ''}`}>
      {/* Day Complete Celebration Banner */}
      {isDayComplete && (
        <div className="day-complete mb-4 p-3 bg-success/10 border border-success/20 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center trophy-celebrate">
              <Trophy className="w-5 h-5 text-success" />
            </div>
            <div>
              <h4 className="font-semibold text-success text-sm">
                {language === 'ru' ? 'Тестовый день завершён!' : 'Test Day Complete!'}
              </h4>
              <p className="text-xs text-success/80">
                {language === 'ru' ? 'Все задачи выполнены с доказательствами' : 'All objectives achieved with proof'}
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
          <div className={`w-2.5 h-2.5 rounded-full ${
            uiState === 'DECISION' ? 'bg-accent animate-pulse' : 
            isDayComplete ? 'bg-success' : 
            'bg-success animate-pulse'
          }`} />
          <span className="text-sm font-semibold text-foreground">
            {isReplay 
              ? (language === 'ru' ? 'Режим воспроизведения' : 'Replay Mode')
              : isDayComplete
              ? (language === 'ru' ? 'День завершён' : 'Day Complete')
              : uiState === 'DECISION'
              ? (language === 'ru' ? 'Ожидание решения CEO' : 'Awaiting CEO Decision')
              : (language === 'ru' ? 'Тестовый день • Активен' : 'Test Day • Active')
            }
          </span>
          {uiState === 'DECISION' && (
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Live event indicator */}
          {currentEvent && !isDayComplete && (
            <div className="hidden sm:flex items-center gap-2 text-xs px-2 py-1 bg-primary/10 rounded animate-fade-in">
              <Activity className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-primary/80">
                {language === 'ru' ? currentEvent.keyRu : currentEvent.keyEn}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className={`font-mono text-sm ${uiState === 'DECISION' ? 'text-accent font-bold' : ''}`}>
              {getCurrentTime()}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar with Event Markers */}
      <div className="relative mb-6">
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear relative ${
              isDayComplete 
                ? 'bg-gradient-to-r from-success to-success/70' 
                : uiState === 'DECISION'
                ? 'bg-gradient-to-r from-accent to-accent/70'
                : 'bg-gradient-to-r from-primary to-primary/70'
            }`}
            style={{ width: `${timelineProgress}%` }}
          >
            {uiState === 'RUNNING' && (
              <div className="absolute inset-0 progress-shimmer" />
            )}
          </div>
        </div>
        
        {/* Event markers on timeline */}
        <div className="absolute inset-x-0 top-0 h-2.5 pointer-events-none">
          {TIMELINE_EVENTS.map((event, i) => (
            <div
              key={i}
              className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                timelineProgress >= event.progress 
                  ? event.isDecision 
                    ? 'bg-accent' 
                    : 'bg-foreground/80' 
                  : 'bg-muted-foreground/30'
              } ${event.isDecision && uiState === 'DECISION' ? 'w-2.5 h-2.5 animate-pulse' : ''}`}
              style={{ left: `${event.progress}%`, transform: 'translate(-50%, -50%)' }}
              title={language === 'ru' ? event.keyRu : event.keyEn}
            />
          ))}
        </div>
        
        {/* Timeline scanner indicator */}
        {uiState === 'RUNNING' && (
          <div 
            className="timeline-scanner h-5 -top-1"
            style={{ left: `${timelineProgress}%` }}
          />
        )}
        
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground font-mono">09:00</span>
          <span className={`text-xs font-mono ${isDayComplete ? 'text-success font-semibold' : uiState === 'DECISION' ? 'text-accent' : 'text-primary'}`}>
            {Math.round(timelineProgress)}%
          </span>
          <span className="text-xs text-muted-foreground font-mono">17:00</span>
        </div>
      </div>

      {/* Three-column HUD layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: Quest Log */}
        <QuestLog />

        {/* Center: CEO Attention */}
        <CeoAttention />

        {/* Right: Mini-map */}
        <MiniMap activeDomain={activeDomain} />
      </div>
    </div>
  );
};

export default RunHUD;