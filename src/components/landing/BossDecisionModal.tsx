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
import { AlertTriangle, Check, X, Camera, Zap, Shield, Clock } from 'lucide-react';
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
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="glass-card border-accent/50 max-w-md overflow-hidden animate-scale-in" 
        style={{ boxShadow: '0 0 60px hsl(var(--accent) / 0.2)' }}
      >
        {/* Header badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
          <Shield className="w-3.5 h-3.5" />
          {language === 'ru' ? 'РЕШЕНИЕ CEO' : 'CEO DECISION'}
        </div>

        <DialogHeader className="pt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent/50">
              <AlertTriangle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <DialogTitle className="text-lg text-foreground">
                {t('decision.title')}
              </DialogTitle>
              <div className="flex items-center gap-1 text-xs text-accent mt-0.5">
                <Clock className="w-3 h-3" />
                <span>15:30</span>
              </div>
            </div>
          </div>
          <DialogDescription className="text-left space-y-3 text-muted-foreground">
            <p className="text-sm">{t('decision.customer')}</p>
            <p className="italic border-l-2 border-accent/50 pl-3 py-2 bg-accent/5 rounded-r text-sm">
              {t('decision.reason')}
            </p>
            <p className="text-sm">{t('decision.cleaner')}</p>
            <p className="font-medium text-foreground pt-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              {t('decision.question')}
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button
            onClick={() => handleActionClick('approve')}
            disabled={!!selectedAction}
            size="lg"
            className={`flex-1 gap-2 bg-success hover:bg-success/90 text-success-foreground h-11 font-semibold transition-transform ${
              selectedAction === 'approve' ? 'scale-95 opacity-70' : ''
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
            className={`flex-1 gap-2 h-11 font-semibold transition-transform ${
              selectedAction === 'deny' ? 'scale-95 opacity-70' : ''
            }`}
          >
            <X className="w-5 h-5" />
            {t('decision.deny')}
          </Button>
          <Button
            onClick={() => handleActionClick('photo')}
            disabled={!!selectedAction}
            variant="outline"
            size="lg"
            className={`flex-1 gap-2 border-accent/50 text-accent hover:bg-accent/10 h-11 font-semibold transition-transform ${
              selectedAction === 'photo' ? 'scale-95 opacity-70' : ''
            }`}
          >
            <Camera className="w-5 h-5" />
            {t('decision.photo')}
          </Button>
        </DialogFooter>

        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-3 h-3 text-accent" />
          {t('decision.footer')}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BossDecisionModal;