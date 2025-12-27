import { useDemo } from '@/contexts/DemoContext';
import { 
  Megaphone, Users, Truck, ShoppingCart, 
  Wallet, BarChart3, Scale, Shield,
  UserCheck, Package, HeadphonesIcon, Lock
} from 'lucide-react';

// Map timeline events to domains
const EVENT_TO_DOMAIN: Record<number, string[]> = {
  0: ['gtm'],                    // Lead captured
  1: ['delivery', 'customer'],   // Service scheduled
  2: ['money', 'accounting'],    // Invoice sent
  3: ['money'],                  // Payment received
  4: ['support', 'people'],      // CEO decision
  5: ['support', 'customer'],    // Feedback
  6: ['data', 'accounting'],     // Day complete
};

const DOMAIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  gtm: Megaphone,
  customer: Users,
  delivery: Truck,
  supply: ShoppingCart,
  money: Wallet,
  accounting: BarChart3,
  legal: Scale,
  risk: Shield,
  people: UserCheck,
  assets: Package,
  support: HeadphonesIcon,
  data: Lock,
};

export const getActiveDomains = (eventIndex: number): string[] => {
  const domains: string[] = [];
  for (let i = 0; i <= eventIndex; i++) {
    if (EVENT_TO_DOMAIN[i]) {
      domains.push(...EVENT_TO_DOMAIN[i]);
    }
  }
  return [...new Set(domains)];
};

export const getDomainIcon = (domainKey: string) => {
  return DOMAIN_ICONS[domainKey] || Megaphone;
};

interface DomainActivityIndicatorProps {
  domainKey: string;
  isActive: boolean;
  wasTriggered: boolean;
}

const DomainActivityIndicator = ({ domainKey, isActive, wasTriggered }: DomainActivityIndicatorProps) => {
  const Icon = getDomainIcon(domainKey);

  return (
    <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
        isActive 
          ? 'bg-primary/20 text-primary shadow-lg shadow-primary/30' 
          : wasTriggered 
            ? 'bg-success/10 text-success' 
            : 'bg-secondary text-muted-foreground'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      {isActive && (
        <div className="absolute inset-0 rounded-lg bg-primary/20 animate-ping" />
      )}
      {wasTriggered && !isActive && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full" />
      )}
    </div>
  );
};

export default DomainActivityIndicator;
