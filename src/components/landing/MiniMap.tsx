import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TranslationKey } from '@/lib/translations';
import { 
  ShoppingCart, Truck, Wallet, HeadphonesIcon, 
  Users, Scale, BarChart3, Package,
  X
} from 'lucide-react';

interface MiniMapProps {
  activeDomain?: string;
  onDomainClick?: (domain: string) => void;
}

const DOMAINS = [
  { key: 'sell', icon: ShoppingCart, position: { x: 15, y: 25 } },
  { key: 'deliver', icon: Truck, position: { x: 40, y: 15 } },
  { key: 'money', icon: Wallet, position: { x: 70, y: 25 } },
  { key: 'support', icon: HeadphonesIcon, position: { x: 85, y: 50 } },
  { key: 'people', icon: Users, position: { x: 70, y: 75 } },
  { key: 'legal', icon: Scale, position: { x: 40, y: 85 } },
  { key: 'reporting', icon: BarChart3, position: { x: 15, y: 75 } },
  { key: 'assets', icon: Package, position: { x: 10, y: 50 } },
] as const;

const MiniMap = ({ activeDomain, onDomainClick }: MiniMapProps) => {
  const { t, language } = useLanguage();
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleNodeClick = (key: string) => {
    setSelectedDomain(selectedDomain === key ? null : key);
    onDomainClick?.(key);
  };

  return (
    <div className="hud-panel">
      <h4 className="text-sm font-semibold text-foreground mb-3">
        {language === 'ru' ? 'Покрытие' : 'Coverage'}
      </h4>

      <div className="minimap aspect-square relative">
        {/* Connection lines (simplified) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="30" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" />
          <circle cx="50" cy="50" r="20" stroke="hsl(var(--border))" strokeWidth="0.3" strokeDasharray="2,2" />
        </svg>

        {/* Domain nodes */}
        {DOMAINS.map(({ key, icon: Icon, position }) => {
          const isActive = activeDomain === key;
          const isHovered = hoveredDomain === key;
          const isSelected = selectedDomain === key;

          return (
            <div
              key={key}
              className={`minimap-node flex items-center justify-center ${isActive ? 'active' : ''}`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: isActive || isHovered || isSelected 
                  ? 'hsl(var(--primary))' 
                  : 'hsl(var(--secondary))',
                color: isActive || isHovered || isSelected 
                  ? 'hsl(var(--primary-foreground))' 
                  : 'hsl(var(--muted-foreground))',
                width: isHovered ? '2rem' : '1.5rem',
                height: isHovered ? '2rem' : '1.5rem',
              }}
              onClick={() => handleNodeClick(key)}
              onMouseEnter={() => setHoveredDomain(key)}
              onMouseLeave={() => setHoveredDomain(null)}
              title={t(`coverage.domain.${key}` as TranslationKey)}
            >
              <Icon className="w-2.5 h-2.5" />
            </div>
          );
        })}

        {/* Center hub */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary/20 border border-primary/50"
          title="HELM"
        />
      </div>

      {/* Selected domain detail */}
      {selectedDomain && (
        <div className="mt-3 p-2 bg-secondary/50 rounded-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">
              {t(`coverage.domain.${selectedDomain}` as TranslationKey)}
            </span>
            <button 
              onClick={() => setSelectedDomain(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ru' ? 'Полностью автоматизировано' : 'Fully automated'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MiniMap;
