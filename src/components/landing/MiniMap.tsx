import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TranslationKey } from '@/lib/translations';
import { 
  ShoppingCart, Truck, Wallet, HeadphonesIcon, 
  Users, Scale, BarChart3, Package,
  X, CheckCircle
} from 'lucide-react';

interface MiniMapProps {
  activeDomain?: string;
  onDomainClick?: (domain: string) => void;
}

const DOMAINS = [
  { key: 'sell', icon: ShoppingCart, position: { x: 15, y: 25 }, labelEn: 'Sell', labelRu: 'Продажи' },
  { key: 'deliver', icon: Truck, position: { x: 40, y: 15 }, labelEn: 'Deliver', labelRu: 'Доставка' },
  { key: 'money', icon: Wallet, position: { x: 70, y: 25 }, labelEn: 'Money', labelRu: 'Деньги' },
  { key: 'support', icon: HeadphonesIcon, position: { x: 85, y: 50 }, labelEn: 'Support', labelRu: 'Поддержка' },
  { key: 'people', icon: Users, position: { x: 70, y: 75 }, labelEn: 'People', labelRu: 'Люди' },
  { key: 'legal', icon: Scale, position: { x: 40, y: 85 }, labelEn: 'Legal', labelRu: 'Право' },
  { key: 'reporting', icon: BarChart3, position: { x: 15, y: 75 }, labelEn: 'Reports', labelRu: 'Отчёты' },
  { key: 'assets', icon: Package, position: { x: 10, y: 50 }, labelEn: 'Assets', labelRu: 'Активы' },
] as const;

const MiniMap = ({ activeDomain, onDomainClick }: MiniMapProps) => {
  const { t, language } = useLanguage();
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleNodeClick = (key: string) => {
    setSelectedDomain(selectedDomain === key ? null : key);
    onDomainClick?.(key);
  };

  const activeOrHovered = hoveredDomain || activeDomain;

  return (
    <div className="hud-panel">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">
          {language === 'ru' ? 'Покрытие' : 'Coverage'}
        </h4>
        {activeDomain && (
          <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded animate-fade-in">
            {DOMAINS.find(d => d.key === activeDomain)?.[language === 'ru' ? 'labelRu' : 'labelEn']}
          </span>
        )}
      </div>

      <div className="minimap aspect-square relative">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
          {/* Outer ring */}
          <circle 
            cx="50" cy="50" r="35" 
            stroke="hsl(var(--border))" 
            strokeWidth="0.5" 
            strokeDasharray="2,2" 
          />
          {/* Inner ring */}
          <circle 
            cx="50" cy="50" r="20" 
            stroke="hsl(var(--border))" 
            strokeWidth="0.3" 
            strokeDasharray="2,2" 
          />
          {/* Connection lines to center */}
          {DOMAINS.map(({ key, position }) => (
            <line
              key={key}
              x1={position.x}
              y1={position.y}
              x2="50"
              y2="50"
              stroke={activeDomain === key ? 'hsl(var(--primary))' : 'hsl(var(--border) / 0.3)'}
              strokeWidth={activeDomain === key ? '1' : '0.5'}
              className="transition-all duration-300"
            />
          ))}
        </svg>

        {/* Domain nodes */}
        {DOMAINS.map(({ key, icon: Icon, position }) => {
          const isActive = activeDomain === key;
          const isHovered = hoveredDomain === key;
          const isSelected = selectedDomain === key;

          return (
            <div
              key={key}
              className={`minimap-node flex items-center justify-center ${isActive ? 'active event-pulse' : ''}`}
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
                width: isActive ? '2rem' : isHovered ? '1.75rem' : '1.5rem',
                height: isActive ? '2rem' : isHovered ? '1.75rem' : '1.5rem',
                zIndex: isActive ? 10 : 1,
              }}
              onClick={() => handleNodeClick(key)}
              onMouseEnter={() => setHoveredDomain(key)}
              onMouseLeave={() => setHoveredDomain(null)}
              title={t(`coverage.domain.${key}` as TranslationKey)}
            >
              <Icon className={`${isActive ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'} transition-all`} />
            </div>
          );
        })}

        {/* Center hub */}
        <div 
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
            activeDomain ? 'bg-primary/30 border-2 border-primary' : 'bg-primary/20 border border-primary/50'
          }`}
          title="HELM"
        >
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      </div>

      {/* Selected domain detail */}
      {selectedDomain && (
        <div className="mt-3 p-2 bg-secondary/50 rounded-lg animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-success" />
              {t(`coverage.domain.${selectedDomain}` as TranslationKey)}
            </span>
            <button 
              onClick={() => setSelectedDomain(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ru' ? 'Полностью управляется HELM' : 'Fully managed by HELM'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MiniMap;
