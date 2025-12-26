import { useLanguage } from '@/hooks/useLanguage';
import { AlertTriangle, CheckCircle, XCircle, Camera, Zap } from 'lucide-react';
import { useDemo } from '@/contexts/DemoContext';

const CeoAttention = () => {
  const { language } = useLanguage();
  const { state } = useDemo();
  
  const { uiState, timeline } = state;
  const { decisionMade } = timeline;
  
  const needsAttention = uiState === 'DECISION';
  const hasDecided = decisionMade !== null;

  return (
    <div className={`hud-panel ${needsAttention ? 'ceo-attention border-accent/50' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <Zap className={`w-4 h-4 ${needsAttention ? 'text-accent' : 'text-muted-foreground'}`} />
        <h4 className="text-sm font-semibold text-foreground">
          {language === 'ru' ? 'Внимание CEO' : 'CEO Attention'}
        </h4>
      </div>

      {needsAttention ? (
        <div className="flex items-center gap-2 text-accent">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">
            {language === 'ru' ? '1 решение требуется' : '1 decision needed'}
          </span>
        </div>
      ) : hasDecided ? (
        <div className={`flex items-center gap-2 decision-confirm ${
          decisionMade === 'approve' ? 'text-success' :
          decisionMade === 'deny' ? 'text-destructive' :
          'text-accent'
        }`}>
          {decisionMade === 'approve' && <CheckCircle className="w-4 h-4" />}
          {decisionMade === 'deny' && <XCircle className="w-4 h-4" />}
          {decisionMade === 'photo' && <Camera className="w-4 h-4" />}
          <span className="text-sm">
            {decisionMade === 'approve' 
              ? (language === 'ru' ? 'Одобрено ✓' : 'Approved ✓')
              : decisionMade === 'deny'
              ? (language === 'ru' ? 'Отклонено' : 'Denied')
              : (language === 'ru' ? 'Фото запрошено' : 'Photo requested')
            }
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">
            {language === 'ru' ? 'Всё под контролем' : 'All clear'}
          </span>
        </div>
      )}
    </div>
  );
};

export default CeoAttention;