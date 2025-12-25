import { useState } from 'react';
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
import { AlertTriangle, Check, X, Camera, Zap, Shield } from 'lucide-react';

interface BossDecisionModalProps {
  open: boolean;
  onDecision: (decision: 'approve' | 'deny' | 'photo') => void;
}

const BossDecisionModal = ({ open, onDecision }: BossDecisionModalProps) => {
  const { t, language } = useLanguage();
  const [selectedAction, setSelectedAction] = useState<'approve' | 'deny' | 'photo' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleActionClick = (action: 'approve' | 'deny' | 'photo') => {
    setSelectedAction(action);
    setIsConfirming(true);
    
    // Visual confirm delay
    setTimeout(() => {
      onDecision(action);
      setSelectedAction(null);
      setIsConfirming(false);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      {/* Boss overlay - darkened background */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-300 pointer-events-none ${
          open ? 'boss-overlay' : 'opacity-0'
        }`}
      />
      
      <DialogContent 
        className={`glass-card border-accent/50 max-w-md z-50 ${
          open ? 'boss-card-enter' : ''
        }`} 
        style={{ boxShadow: '0 0 80px hsl(38 92% 50% / 0.25), 0 0 120px hsl(38 92% 50% / 0.1)' }}
      >
        {/* Boss encounter header */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full flex items-center gap-1">
          <Shield className="w-3 h-3" />
          {language === 'ru' ? 'РЕШЕНИЕ CEO' : 'CEO DECISION'}
        </div>

        <DialogHeader className="pt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border-2 border-accent/30">
              <AlertTriangle className="w-6 h-6 text-accent" />
            </div>
            <DialogTitle className="text-xl text-foreground">
              {t('decision.title')}
            </DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-2 text-muted-foreground">
            <p>{t('decision.customer')}</p>
            <p className="italic border-l-2 border-accent/50 pl-3 py-1 bg-accent/5 rounded-r">
              {t('decision.reason')}
            </p>
            <p>{t('decision.cleaner')}</p>
            <p className="font-medium text-foreground pt-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              {t('decision.question')}
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={() => handleActionClick('approve')}
            disabled={isConfirming}
            className={`flex-1 gap-2 bg-success hover:bg-success/90 text-success-foreground transition-all ${
              selectedAction === 'approve' ? 'decision-confirm scale-105' : ''
            }`}
          >
            <Check className="w-4 h-4" />
            {t('decision.approve')}
          </Button>
          <Button
            onClick={() => handleActionClick('deny')}
            disabled={isConfirming}
            variant="destructive"
            className={`flex-1 gap-2 transition-all ${
              selectedAction === 'deny' ? 'decision-confirm scale-105' : ''
            }`}
          >
            <X className="w-4 h-4" />
            {t('decision.deny')}
          </Button>
          <Button
            onClick={() => handleActionClick('photo')}
            disabled={isConfirming}
            variant="outline"
            className={`flex-1 gap-2 border-accent/50 text-accent hover:bg-accent/10 transition-all ${
              selectedAction === 'photo' ? 'decision-confirm scale-105' : ''
            }`}
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
