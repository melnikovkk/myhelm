import { useLanguage } from '@/hooks/useLanguage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, X, Camera, Zap } from 'lucide-react';

interface BossDecisionModalProps {
  open: boolean;
  onDecision: (decision: 'approve' | 'deny' | 'photo') => void;
}

const BossDecisionModal = ({ open, onDecision }: BossDecisionModalProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="glass-card border-accent/50 max-w-md glow-accent" style={{ boxShadow: '0 0 60px hsl(38 92% 50% / 0.2)' }}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-accent" />
            </div>
            <DialogTitle className="text-xl text-foreground">
              {t('decision.title')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-2 text-muted-foreground">
            <p>{t('decision.customer')}</p>
            <p className="italic">{t('decision.reason')}</p>
            <p>{t('decision.cleaner')}</p>
            <p className="font-medium text-foreground pt-2">{t('decision.question')}</p>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
          <Button
            onClick={() => onDecision('approve')}
            className="flex-1 gap-2 bg-success hover:bg-success/90 text-success-foreground"
          >
            <Check className="w-4 h-4" />
            {t('decision.approve')}
          </Button>
          <Button
            onClick={() => onDecision('deny')}
            variant="destructive"
            className="flex-1 gap-2"
          >
            <X className="w-4 h-4" />
            {t('decision.deny')}
          </Button>
          <Button
            onClick={() => onDecision('photo')}
            variant="outline"
            className="flex-1 gap-2 border-accent/50 text-accent hover:bg-accent/10"
          >
            <Camera className="w-4 h-4" />
            {t('decision.photo')}
          </Button>
        </DialogFooter>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-3 h-3 text-accent" />
          {t('decision.footer')}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BossDecisionModal;
