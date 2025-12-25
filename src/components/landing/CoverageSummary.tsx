import { useLanguage } from '@/hooks/useLanguage';
import { TranslationKey } from '@/lib/translations';
import { 
  ShoppingCart, Truck, Wallet, HeadphonesIcon, 
  Users, Scale, BarChart3, Package 
} from 'lucide-react';

const DOMAINS = [
  { key: 'sell', icon: ShoppingCart },
  { key: 'deliver', icon: Truck },
  { key: 'money', icon: Wallet },
  { key: 'support', icon: HeadphonesIcon },
  { key: 'people', icon: Users },
  { key: 'legal', icon: Scale },
  { key: 'reporting', icon: BarChart3 },
  { key: 'assets', icon: Package },
] as const;

const CoverageSummary = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t('coverage.title')}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t('coverage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-4xl mx-auto">
          {DOMAINS.map(({ key, icon: Icon }, i) => (
            <div 
              key={key}
              className="glass-card p-3 md:p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <span className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {t(`coverage.domain.${key}` as TranslationKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoverageSummary;
