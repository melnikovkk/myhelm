import { forwardRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TranslationKey } from '@/lib/translations';
import { 
  Megaphone, Users, Truck, ShoppingCart, 
  Wallet, BarChart3, Scale, Shield,
  UserCheck, Package, HeadphonesIcon, Lock
} from 'lucide-react';

const DOMAINS = [
  { key: 'gtm', icon: Megaphone },
  { key: 'customer', icon: Users },
  { key: 'delivery', icon: Truck },
  { key: 'supply', icon: ShoppingCart },
  { key: 'money', icon: Wallet },
  { key: 'accounting', icon: BarChart3 },
  { key: 'legal', icon: Scale },
  { key: 'risk', icon: Shield },
  { key: 'people', icon: UserCheck },
  { key: 'assets', icon: Package },
  { key: 'support', icon: HeadphonesIcon },
  { key: 'data', icon: Lock },
] as const;

const CoverageSummary = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();

  return (
    <section ref={ref} className="py-16 md:py-24 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            {t('coverage.title')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('coverage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {DOMAINS.map(({ key, icon: Icon }) => (
            <div 
              key={key}
              className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <span className="text-xs text-center font-medium text-muted-foreground">
                {t(`coverage.domain.${key}` as TranslationKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

CoverageSummary.displayName = 'CoverageSummary';

export default CoverageSummary;