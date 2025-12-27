import { useLanguage } from '@/hooks/useLanguage';
import { Clock, Trophy, Sparkles, PartyPopper, Activity } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';
import QuestLog from './QuestLog';
import CeoAttention from './CeoAttention';
import MiniMap from './MiniMap';

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
  const { progress: timelineProgress } = timeline;
  
  const showHUD = ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(uiState);
  
  if (!showHUD) return null;

  const getCurrentTime = () => {
    const hours = 9 + (timelineProgress / 100) * 8;
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

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
    <div className={`glass-card p-4 md:p-6 mb-6 animate-fade-in ${
      isDayComplete ? 'border-success/30' : 
      uiState === 'DECISION' ? 'border-accent/50 boss-pulse' : ''
    }`}>
      {/* Day Complete Banner */}
      {isDayComplete && (
        <div className="day-complete mb-5 p-4 bg-success/10 border border-success/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center trophy-celebrate">
              <Trophy className="w-6 h-6 text-success" />
            </div>
            <div>
              <h4 className="font-bold text-success">
                {language === 'ru' ? 'Тестовый день завершён!' : 'Test Day Complete!'}
              </h4>
              <p className="text-sm text-success/80">
                {language === 'ru' ? 'Все задачи выполнены с доказательствами' : 'All objectives achieved with proof'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PartyPopper className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-mono font-bold text-success bg-success/10 px-3 py-1.5 rounded-lg">
              3/3
            </span>
          </div>
        </div>
      )}

      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            uiState === 'DECISION' ? 'bg-accent animate-pulse' : 
            isDayComplete ? 'bg-success' : 
            'bg-success animate-pulse'
          }`} />
          <span className="font-semibold text-foreground">
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
        <div className="flex items-center gap-4">
          {currentEvent && !isDayComplete && (
            <div className="hidden md:flex items-center gap-2 text-sm px-3 py-1.5 bg-primary/10 rounded-lg">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-primary font-medium">
                {language === 'ru' ? currentEvent.keyRu : currentEvent.keyEn}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className={`font-mono text-sm font-medium ${uiState === 'DECISION' ? 'text-accent' : ''}`}>
              {getCurrentTime()}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-100 ease-linear relative ${
              isDayComplete 
                ? 'bg-gradient-to-r from-success to-success/80' 
                : uiState === 'DECISION'
                ? 'bg-gradient-to-r from-accent to-accent/80'
                : 'bg-gradient-to-r from-primary to-primary/80'
            }`}
            style={{ width: `${timelineProgress}%` }}
          >
            {uiState === 'RUNNING' && <div className="absolute inset-0 progress-shimmer" />}
          </div>
        </div>
        
        {/* Event markers */}
        <div className="absolute inset-x-0 top-0 h-3 pointer-events-none">
          {TIMELINE_EVENTS.map((event, i) => (
            <div
              key={i}
              className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                timelineProgress >= event.progress 
                  ? event.isDecision 
                    ? 'w-2 h-2 bg-accent' 
                    : 'w-1.5 h-1.5 bg-foreground/70' 
                  : 'w-1.5 h-1.5 bg-muted-foreground/30'
              } ${event.isDecision && uiState === 'DECISION' ? 'w-3 h-3 animate-pulse' : ''}`}
              style={{ left: `${event.progress}%`, transform: 'translate(-50%, -50%)' }}
            />
          ))}
        </div>
        
        {uiState === 'RUNNING' && (
          <div 
            className="timeline-scanner h-6 -top-1.5"
            style={{ left: `${timelineProgress}%` }}
          />
        )}
        
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground font-mono">09:00</span>
          <span className={`text-xs font-mono font-semibold ${
            isDayComplete ? 'text-success' : 
            uiState === 'DECISION' ? 'text-accent' : 
            'text-primary'
          }`}>
            {Math.round(timelineProgress)}%
          </span>
          <span className="text-xs text-muted-foreground font-mono">17:00</span>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="order-2 md:order-1">
          <QuestLog />
        </div>
        <div className="order-1 md:order-2">
          <CeoAttention />
        </div>
        <div className="order-3 hidden md:block">
          <MiniMap activeDomain={activeDomain} />
        </div>
      </div>
    </div>
  );
};

export default RunHUD;
