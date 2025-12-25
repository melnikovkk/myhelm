import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Camera, FileCheck, Receipt, Lock } from 'lucide-react';

const ProofSection = () => {
  const { t, language } = useLanguage();

  const proofItems = [
    { icon: Camera, label: language === 'ru' ? 'Фото подтверждения' : 'Photo confirmations' },
    { icon: FileCheck, label: language === 'ru' ? 'Подписанные решения' : 'Signed decisions' },
    { icon: Receipt, label: language === 'ru' ? 'Чеки и транзакции' : 'Receipts & transactions' },
    { icon: Lock, label: language === 'ru' ? 'Неизменяемый аудит' : 'Immutable audit trail' },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Vault Icon */}
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8 glow-border">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('proof.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            {t('proof.subtitle')}
          </p>

          {/* Proof items */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {proofItems.map(({ icon: Icon, label }, i) => (
              <div 
                key={i}
                className="glass-card p-4 flex flex-col items-center gap-3 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-success" />
                </div>
                <span className="text-sm text-foreground text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
