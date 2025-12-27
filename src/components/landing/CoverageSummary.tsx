import { forwardRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TranslationKey } from '@/lib/translations';
import { 
  Megaphone, Users, Truck, ShoppingCart, 
  Wallet, BarChart3, Scale, Shield,
  UserCheck, Package, HeadphonesIcon, Lock,
  CheckCircle, Brain, FileCheck
} from 'lucide-react';

// 12 Business Domains
const DOMAINS = [
  { key: 'gtm', icon: Megaphone, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'customer', icon: Users, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'delivery', icon: Truck, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'supply', icon: ShoppingCart, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'money', icon: Wallet, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'accounting', icon: BarChart3, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'legal', icon: Scale, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'risk', icon: Shield, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'people', icon: UserCheck, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'assets', icon: Package, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'support', icon: HeadphonesIcon, runsCount: 3, decidesCount: 1, proofCount: 2 },
  { key: 'data', icon: Lock, runsCount: 3, decidesCount: 1, proofCount: 2 },
] as const;

const CoverageSummary = forwardRef<HTMLElement>((_, ref) => {
  const { t, language } = useLanguage();

  return (
    <section ref={ref} className="py-12 md:py-20 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t('coverage.title')}
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {t('coverage.subtitle')}
          </p>
        </div>

        {/* Compact 12-Domain Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 max-w-5xl mx-auto">
          {DOMAINS.map(({ key, icon: Icon, runsCount, decidesCount, proofCount }, i) => (
            <div 
              key={key}
              className="glass-card p-3 flex flex-col items-center gap-2 hover:border-primary/30 transition-all group cursor-default opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-center font-medium text-foreground leading-tight">
                {t(`coverage.domain.${key}` as TranslationKey)}
              </span>
              {/* Mini indicators */}
              <div className="flex items-center gap-1 text-[10px]">
                <span className="flex items-center gap-0.5 text-success" title={language === 'ru' ? 'Выполняет' : 'Runs'}>
                  <CheckCircle className="w-2.5 h-2.5" />
                  {runsCount}
                </span>
                <span className="flex items-center gap-0.5 text-accent" title={language === 'ru' ? 'CEO решает' : 'CEO decides'}>
                  <Brain className="w-2.5 h-2.5" />
                  {decidesCount}
                </span>
                <span className="flex items-center gap-0.5 text-primary" title={language === 'ru' ? 'Доказательства' : 'Proof'}>
                  <FileCheck className="w-2.5 h-2.5" />
                  {proofCount}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-success" />
            {t('coverage.runs')}
          </span>
          <span className="flex items-center gap-1">
            <Brain className="w-3 h-3 text-accent" />
            {t('coverage.decides')}
          </span>
          <span className="flex items-center gap-1">
            <FileCheck className="w-3 h-3 text-primary" />
            {t('coverage.proof')}
          </span>
        </div>
      </div>
    </section>
  );
});

CoverageSummary.displayName = 'CoverageSummary';

export default CoverageSummary;
