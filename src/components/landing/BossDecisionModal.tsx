import { useState, useEffect } from 'react';
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
import { AlertTriangle, Check, X, Camera, Zap, Shield, Clock, Sparkles } from 'lucide-react';

interface BossDecisionModalProps {
  open: boolean;
  onDecision: (decision: 'approve' | 'deny' | 'photo') => void;
}

const BossDecisionModal = ({ open, onDecision }: BossDecisionModalProps) => {
  const { t, language } = useLanguage();
  const [selectedAction, setSelectedAction] = useState<'approve' | 'deny' | 'photo' | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showContent, setShowContent] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedAction(null);
      setIsConfirming(false);
      setCountdown(3);
      setShowContent(false);
      
      // Countdown effect before showing content
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowContent(true);
            return 0;
          }
          return prev - 1;
        });
      }, 400);
      
      return () => clearInterval(timer);
    }
  }, [open]);

  const handleActionClick = (action: 'approve' | 'deny' | 'photo') => {
    setSelectedAction(action);
    setIsConfirming(true);
    
    // Visual confirm delay
    setTimeout(() => {
      onDecision(action);
      setSelectedAction(null);
      setIsConfirming(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      {/* Boss overlay - darkened background with pulsing effect */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-300 pointer-events-none ${
          open ? 'boss-overlay' : 'opacity-0'
        }`}
      />
      
      <DialogContent 
        className={`glass-card border-accent/50 max-w-md z-50 overflow-hidden ${
          open ? 'boss-card-enter' : ''
        } ${showContent ? 'boss-pulse' : ''}`} 
        style={{ boxShadow: '0 0 80px hsl(38 92% 50% / 0.25), 0 0 120px hsl(38 92% 50% / 0.1)' }}
      >
        {/* Animated ring effect */}
        {showContent && <div className="boss-attention-ring" />}
        
        {/* Sparkle decorations */}
        {showContent && (
          <>
            <Sparkles className="sparkle" style={{ top: '10%', left: '10%', animationDelay: '0s' }} />
            <Sparkles className="sparkle" style={{ top: '15%', right: '15%', animationDelay: '0.5s' }} />
            <Sparkles className="sparkle" style={{ bottom: '20%', left: '20%', animationDelay: '1s' }} />
          </>
        )}

        {/* Boss encounter header */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg shadow-accent/25">
          <Shield className="w-3.5 h-3.5" />
          {language === 'ru' ? 'РЕШЕНИЕ CEO' : 'CEO DECISION'}
        </div>

        {/* Countdown display */}
        {!showContent && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent countdown-pulse">
              <span className="text-3xl font-bold text-accent">{countdown}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {language === 'ru' ? 'Требуется ваше решение...' : 'Your decision is needed...'}
            </p>
          </div>
        )}

        {/* Main content */}
        {showContent && (
          <>
            <DialogHeader className="pt-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent/50 animate-scale-in">
                  <AlertTriangle className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <DialogTitle className="text-xl text-foreground">
                    {t('decision.title')}
                  </DialogTitle>
                  <div className="flex items-center gap-1 text-xs text-accent mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>15:30</span>
                  </div>
                </div>
              </div>
              <DialogDescription className="text-left space-y-3 text-muted-foreground animate-fade-in">
                <p className="text-sm">{t('decision.customer')}</p>
                <div className="relative">
                  <p className="italic border-l-2 border-accent/50 pl-3 py-2 bg-accent/5 rounded-r text-sm">
                    {t('decision.reason')}
                  </p>
                </div>
                <p className="text-sm">{t('decision.cleaner')}</p>
                <p className="font-medium text-foreground pt-2 flex items-center gap-2 text-base">
                  <Zap className="w-5 h-5 text-accent animate-pulse" />
                  {t('decision.question')}
                </p>
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="flex-col sm:flex-row gap-3 mt-6">
              <Button
                onClick={() => handleActionClick('approve')}
                disabled={isConfirming}
                size="lg"
                className={`flex-1 gap-2 bg-success hover:bg-success/90 text-success-foreground transition-all h-12 text-base font-semibold ${
                  selectedAction === 'approve' ? 'decision-confirm scale-105 ring-4 ring-success/30' : ''
                }`}
              >
                <Check className="w-5 h-5" />
                {t('decision.approve')}
              </Button>
              <Button
                onClick={() => handleActionClick('deny')}
                disabled={isConfirming}
                variant="destructive"
                size="lg"
                className={`flex-1 gap-2 transition-all h-12 text-base font-semibold ${
                  selectedAction === 'deny' ? 'decision-confirm scale-105 ring-4 ring-destructive/30' : ''
                }`}
              >
                <X className="w-5 h-5" />
                {t('decision.deny')}
              </Button>
              <Button
                onClick={() => handleActionClick('photo')}
                disabled={isConfirming}
                variant="outline"
                size="lg"
                className={`flex-1 gap-2 border-accent/50 text-accent hover:bg-accent/10 transition-all h-12 text-base font-semibold ${
                  selectedAction === 'photo' ? 'decision-confirm scale-105 ring-4 ring-accent/30' : ''
                }`}
              >
                <Camera className="w-5 h-5" />
                {t('decision.photo')}
              </Button>
            </DialogFooter>

            <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground animate-fade-in">
              <Zap className="w-3 h-3 text-accent" />
              {t('decision.footer')}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BossDecisionModal;
