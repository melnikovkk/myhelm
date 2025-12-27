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
    <section ref={ref} className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
              {t('coverage.title')}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
              {t('coverage.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {DOMAINS.map(({ key, icon: Icon }) => (
              <div 
                key={key}
                className="flex flex-col items-center gap-2.5 p-3 md:p-4 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                </div>
                <span className="text-[11px] md:text-xs text-center font-medium text-muted-foreground leading-tight">
                  {t(`coverage.domain.${key}` as TranslationKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

CoverageSummary.displayName = 'CoverageSummary';

export default CoverageSummary;