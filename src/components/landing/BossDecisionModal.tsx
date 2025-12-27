import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, X, Camera, Zap, Shield, Clock, Sparkles } from 'lucide-react';
import type { DecisionType } from '@/lib/demoStore';

const BossDecisionModal = () => {
  const { t, language } = useLanguage();
  const { state, actions } = useDemo();
  const [selectedAction, setSelectedAction] = useState<DecisionType | null>(null);

  const open = state.uiState === 'DECISION';

  const handleActionClick = (action: DecisionType) => {
    if (selectedAction) return; // Prevent double-clicks
    setSelectedAction(action);
    
    // Brief visual feedback then trigger decision
    setTimeout(() => {
      actions.makeDecision(action);
      setSelectedAction(null);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="glass-card border-accent/50 max-w-md overflow-hidden boss-card-enter" 
        style={{ boxShadow: '0 0 80px hsl(var(--accent) / 0.25)' }}
      >
        {/* Animated border glow */}
        <div className="boss-attention-ring" />

        {/* Header badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg glow-accent">
          <Shield className="w-3.5 h-3.5" />
          {language === 'ru' ? 'РЕШЕНИЕ CEO' : 'CEO DECISION'}
          <Sparkles className="w-3 h-3 animate-pulse" />
        </div>

        <DialogHeader className="pt-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent/50 boss-pulse">
              <AlertTriangle className="w-7 h-7 text-accent" />
            </div>
            <div>
              <DialogTitle className="text-lg text-foreground">
                {t('decision.title')}
              </DialogTitle>
              <div className="flex items-center gap-2 text-xs text-accent mt-1">
                <Clock className="w-3 h-3" />
                <span className="font-mono">15:30</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{language === 'ru' ? 'Нужен ответ' : 'Response needed'}</span>
              </div>
            </div>
          </div>
          <DialogDescription className="text-left space-y-3 text-muted-foreground">
            <p className="text-sm">{t('decision.customer')}</p>
            <div className="italic border-l-2 border-accent/50 pl-3 py-2 bg-accent/5 rounded-r text-sm">
              <p>{t('decision.reason')}</p>
            </div>
            <p className="text-sm">{t('decision.cleaner')}</p>
            <div className="font-medium text-foreground pt-2 flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-lg">
              <Zap className="w-4 h-4 text-accent shrink-0" />
              <span>{t('decision.question')}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col gap-2 mt-5">
          {/* Primary actions row */}
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => handleActionClick('approve')}
              disabled={!!selectedAction}
              size="lg"
              className={`flex-1 gap-2 bg-success hover:bg-success/90 text-success-foreground h-12 font-semibold transition-all ${
                selectedAction === 'approve' ? 'scale-95 opacity-70' : 'hover:scale-[1.02]'
              }`}
            >
              <Check className="w-5 h-5" />
              {t('decision.approve')}
            </Button>
            <Button
              onClick={() => handleActionClick('deny')}
              disabled={!!selectedAction}
              variant="destructive"
              size="lg"
              className={`flex-1 gap-2 h-12 font-semibold transition-all ${
                selectedAction === 'deny' ? 'scale-95 opacity-70' : 'hover:scale-[1.02]'
              }`}
            >
              <X className="w-5 h-5" />
              {t('decision.deny')}
            </Button>
          </div>
          
          {/* Secondary action */}
          <Button
            onClick={() => handleActionClick('photo')}
            disabled={!!selectedAction}
            variant="outline"
            size="lg"
            className={`w-full gap-2 border-accent/50 text-accent hover:bg-accent/10 h-11 font-semibold transition-all ${
              selectedAction === 'photo' ? 'scale-95 opacity-70' : 'hover:scale-[1.02]'
            }`}
          >
            <Camera className="w-5 h-5" />
            {t('decision.photo')}
          </Button>
        </DialogFooter>

        <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-3 h-3 text-accent" />
          <span>{t('decision.footer')}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BossDecisionModal;