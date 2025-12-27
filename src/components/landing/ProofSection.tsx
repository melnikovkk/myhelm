import { forwardRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Camera, FileCheck, Receipt, Lock, RotateCcw } from 'lucide-react';
import proofVaultImage from '@/assets/proof-vault.png';

const ProofSection = forwardRef<HTMLElement>((_, ref) => {
  const { t, language } = useLanguage();

  const proofItems = [
    { icon: Camera, label: language === 'ru' ? 'Фото подтверждения' : 'Photo confirmations', color: 'text-primary' },
    { icon: FileCheck, label: language === 'ru' ? 'Подписанные решения' : 'Signed decisions', color: 'text-success' },
    { icon: Receipt, label: language === 'ru' ? 'Чеки и транзакции' : 'Receipts & transactions', color: 'text-accent' },
    { icon: Lock, label: language === 'ru' ? 'Неизменяемый аудит' : 'Immutable audit trail', color: 'text-primary' },
  ];

  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Image */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <img 
                src={proofVaultImage} 
                alt="Security Vault" 
                className="w-full h-full object-contain animate-float drop-shadow-2xl"
              />
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-success/10 to-primary/20 rounded-full blur-3xl -z-10 opacity-60" />
            </div>
          </div>

          {/* Right: Content */}
          <div className="text-center lg:text-left order-1 lg:order-2">

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('proof.title')}
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto lg:mx-0">
            {t('proof.subtitle')}
          </p>

          {/* Proof items - 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {proofItems.map(({ icon: Icon, label, color }, i) => (
              <div 
                key={i}
                className="glass-card p-4 flex items-center gap-3 card-interactive group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-sm text-foreground font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Deterministic Replay highlight */}
          <div className="glass-card p-5 border-primary/30 inline-flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-foreground mb-1">{t('proof.replay')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('proof.replay.desc')}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
});

ProofSection.displayName = 'ProofSection';

export default ProofSection;
