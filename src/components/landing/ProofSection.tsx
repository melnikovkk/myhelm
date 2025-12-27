import { forwardRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Camera, FileCheck, Receipt, Lock, RotateCcw } from 'lucide-react';

const ProofSection = forwardRef<HTMLElement>((_, ref) => {
  const { t, language } = useLanguage();

  const proofItems = [
    { icon: Camera, label: language === 'ru' ? 'Фото подтверждения' : 'Photo confirmations' },
    { icon: FileCheck, label: language === 'ru' ? 'Подписанные решения' : 'Signed decisions' },
    { icon: Receipt, label: language === 'ru' ? 'Чеки и транзакции' : 'Receipts & transactions' },
    { icon: Lock, label: language === 'ru' ? 'Неизменяемый аудит' : 'Immutable audit trail' },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-14">
            <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-5">
              <Shield className="w-5 h-5 text-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              {t('proof.title')}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
              {t('proof.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-12">
            {proofItems.map(({ icon: Icon, label }, i) => (
              <div 
                key={i}
                className="flex flex-col items-center gap-2.5 p-4 md:p-5 rounded-xl bg-secondary/50"
              >
                <Icon className="w-5 h-5 text-foreground" />
                <span className="text-xs text-center text-muted-foreground leading-tight">{label}</span>
              </div>
            ))}
          </div>

          <div className="bg-secondary/50 rounded-xl p-5 md:p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border">
              <RotateCcw className="w-4 h-4 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1 text-sm md:text-base">{t('proof.replay')}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {t('proof.replay.desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

ProofSection.displayName = 'ProofSection';

export default ProofSection;