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
    <section ref={ref} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-6">
              <Shield className="w-6 h-6 text-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              {t('proof.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('proof.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {proofItems.map(({ icon: Icon, label }, i) => (
              <div 
                key={i}
                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-secondary/50"
              >
                <Icon className="w-5 h-5 text-foreground" />
                <span className="text-xs text-center text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          <div className="bg-secondary/50 rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{t('proof.replay')}</h3>
              <p className="text-sm text-muted-foreground">
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