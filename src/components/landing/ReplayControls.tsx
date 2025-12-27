import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  FastForward,
  RotateCcw,
  Keyboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TIMELINE_EVENTS = [
  { time: '09:00', progress: 0, keyEn: 'Start', keyRu: 'Старт' },
  { time: '10:00', progress: 12.5, keyEn: 'Lead captured', keyRu: 'Лид захвачен' },
  { time: '12:00', progress: 37.5, keyEn: 'Service scheduled', keyRu: 'Услуга запланирована' },
  { time: '14:00', progress: 62.5, keyEn: 'Invoice sent', keyRu: 'Счёт отправлен' },
  { time: '15:00', progress: 75, keyEn: 'Payment received', keyRu: 'Платёж получен' },
  { time: '15:30', progress: 81.25, keyEn: 'CEO decision', keyRu: 'Решение CEO' },
  { time: '16:00', progress: 87.5, keyEn: 'Feedback', keyRu: 'Отзыв' },
  { time: '17:00', progress: 100, keyEn: 'Day complete', keyRu: 'День завершён' },
];

const PLAYBACK_SPEEDS = [0.5, 1, 2, 4];

const ReplayControls = () => {
  const { language } = useLanguage();
  const { state, isReplay, actions } = useDemo();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isReplay) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipToNextEvent();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipToPrevEvent();
          break;
        case 'ArrowUp':
          e.preventDefault();
          cycleSpeed(1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          cycleSpeed(-1);
          break;
        case 'r':
        case 'R':
          actions.scrubReplay(0);
          break;
        case '?':
          setShowKeyboardHints(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReplay, state.timeline.progress]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying || !isReplay) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      return;
    }

    playIntervalRef.current = setInterval(() => {
      const newProgress = Math.min(100, state.timeline.progress + 0.5 * playbackSpeed);
      if (newProgress >= 100) {
        setIsPlaying(false);
      }
      actions.scrubReplay(newProgress);
    }, 50);

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, isReplay, playbackSpeed, state.timeline.progress]);

  const skipToNextEvent = () => {
    const currentProgress = state.timeline.progress;
    const nextEvent = TIMELINE_EVENTS.find(e => e.progress > currentProgress);
    if (nextEvent) {
      actions.scrubReplay(nextEvent.progress);
    }
  };

  const skipToPrevEvent = () => {
    const currentProgress = state.timeline.progress;
    const prevEvents = TIMELINE_EVENTS.filter(e => e.progress < currentProgress - 1);
    if (prevEvents.length > 0) {
      actions.scrubReplay(prevEvents[prevEvents.length - 1].progress);
    } else {
      actions.scrubReplay(0);
    }
  };

  const cycleSpeed = (direction: number) => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackSpeed);
    const nextIndex = Math.max(0, Math.min(PLAYBACK_SPEEDS.length - 1, currentIndex + direction));
    setPlaybackSpeed(PLAYBACK_SPEEDS[nextIndex]);
  };

  const getCurrentEventLabel = () => {
    for (let i = TIMELINE_EVENTS.length - 1; i >= 0; i--) {
      if (state.timeline.progress >= TIMELINE_EVENTS[i].progress) {
        return language === 'ru' ? TIMELINE_EVENTS[i].keyRu : TIMELINE_EVENTS[i].keyEn;
      }
    }
    return '';
  };

  if (!isReplay) return null;

  return (
    <TooltipProvider>
      <div className="glass-card p-4 rounded-xl space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            {language === 'ru' ? 'Воспроизведение дня' : 'Day Replay'}
            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {getCurrentEventLabel()}
            </span>
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => setShowKeyboardHints(prev => !prev)}
                className={`p-1.5 rounded-lg transition-colors ${showKeyboardHints ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{language === 'ru' ? 'Клавиатурные сокращения' : 'Keyboard shortcuts'}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Keyboard hints */}
        {showKeyboardHints && (
          <div className="p-3 bg-secondary/50 rounded-lg text-xs space-y-1 animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Space</span>
              <span className="text-foreground">{language === 'ru' ? 'Пауза/Воспр.' : 'Play/Pause'}</span>
              <span className="text-muted-foreground">← →</span>
              <span className="text-foreground">{language === 'ru' ? 'К событию' : 'Skip event'}</span>
              <span className="text-muted-foreground">↑ ↓</span>
              <span className="text-foreground">{language === 'ru' ? 'Скорость' : 'Speed'}</span>
              <span className="text-muted-foreground">R</span>
              <span className="text-foreground">{language === 'ru' ? 'В начало' : 'Reset'}</span>
            </div>
          </div>
        )}

        {/* Timeline slider with event markers */}
        <div className="relative">
          <Slider 
            value={[state.timeline.progress]} 
            onValueChange={([v]) => {
              setIsPlaying(false);
              actions.scrubReplay(v);
            }} 
            max={100} 
            step={0.5}
            className="cursor-pointer"
          />
          
          {/* Event markers */}
          <div className="absolute inset-x-0 top-2 h-1 pointer-events-none">
            {TIMELINE_EVENTS.slice(1, -1).map((event, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 transition-colors ${
                      state.timeline.progress >= event.progress ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                    style={{ left: `${event.progress}%` }}
                  />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">{language === 'ru' ? event.keyRu : event.keyEn}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">09:00</span>
            <span className="text-[10px] text-primary font-mono">{Math.round(state.timeline.progress)}%</span>
            <span className="text-[10px] text-muted-foreground">17:00</span>
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => actions.scrubReplay(0)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{language === 'ru' ? 'В начало (R)' : 'Reset (R)'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={skipToPrevEvent}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{language === 'ru' ? 'Назад (←)' : 'Previous (←)'}</p>
            </TooltipContent>
          </Tooltip>

          <Button 
            variant="default" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={() => setIsPlaying(prev => !prev)}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={skipToNextEvent}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{language === 'ru' ? 'Вперёд (→)' : 'Next (→)'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => cycleSpeed(1)}
                className="h-8 px-2 rounded-lg bg-secondary/50 hover:bg-secondary text-xs font-mono text-foreground flex items-center gap-1 transition-colors"
              >
                <FastForward className="w-3 h-3" />
                {playbackSpeed}x
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{language === 'ru' ? 'Скорость (↑↓)' : 'Speed (↑↓)'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ReplayControls;
