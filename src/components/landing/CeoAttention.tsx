import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { AlertTriangle, CheckCircle, XCircle, Camera, Zap, Timer } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';

const CeoAttention = () => {
  const { language } = useLanguage();
  const { state } = useDemo();
  const [waitTime, setWaitTime] = useState(0);
  
  const { uiState, timeline } = state;
  const { decisionMade } = timeline;
  
  const needsAttention = uiState === 'DECISION';
  const hasDecided = decisionMade !== null;

  // Count up timer when waiting for decision
  useEffect(() => {
    if (!needsAttention) {
      setWaitTime(0);
      return;
    }

    const interval = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [needsAttention]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`hud-panel transition-all duration-300 ${needsAttention ? 'ceo-attention border-accent/50' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <Zap className={`w-4 h-4 ${needsAttention ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
        <h4 className="text-sm font-semibold text-foreground">
          {language === 'ru' ? 'Внимание CEO' : 'CEO Attention'}
        </h4>
      </div>

      {needsAttention ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-accent">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="text-sm font-medium">
              {language === 'ru' ? '1 решение требуется' : '1 decision needed'}
            </span>
          </div>
          
          {/* Waiting timer */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">
              {language === 'ru' ? 'Ожидание:' : 'Waiting:'} {formatTime(waitTime)}
            </span>
          </div>

          {/* Action hint */}
          <div className="text-xs text-accent/80 bg-accent/5 px-2 py-1.5 rounded border border-accent/20">
            {language === 'ru' 
              ? '↑ Откройте модальное окно выше'
              : '↑ Open the modal above to decide'}
          </div>
        </div>
      ) : hasDecided ? (
        <div className={`flex items-center gap-3 p-2 rounded-lg decision-confirm ${
          decisionMade === 'approve' ? 'bg-success/10 text-success' :
          decisionMade === 'deny' ? 'bg-destructive/10 text-destructive' :
          'bg-accent/10 text-accent'
        }`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            decisionMade === 'approve' ? 'bg-success/20' :
            decisionMade === 'deny' ? 'bg-destructive/20' :
            'bg-accent/20'
          }`}>
            {decisionMade === 'approve' && <CheckCircle className="w-4 h-4" />}
            {decisionMade === 'deny' && <XCircle className="w-4 h-4" />}
            {decisionMade === 'photo' && <Camera className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-sm font-medium block">
              {decisionMade === 'approve' 
                ? (language === 'ru' ? 'Одобрено' : 'Approved')
                : decisionMade === 'deny'
                ? (language === 'ru' ? 'Отклонено' : 'Denied')
                : (language === 'ru' ? 'Фото запрошено' : 'Photo requested')
              }
            </span>
            <span className="text-xs opacity-70">
              {language === 'ru' ? 'Записано в журнал' : 'Logged with proof'}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-2 rounded-lg bg-success/5">
          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-success" />
          </div>
          <div>
            <span className="text-sm text-success block">
              {language === 'ru' ? 'Всё под контролем' : 'All clear'}
            </span>
            <span className="text-xs text-muted-foreground">
              {language === 'ru' ? 'Нет ожидающих решений' : 'No pending decisions'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CeoAttention;