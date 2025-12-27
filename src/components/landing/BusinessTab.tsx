import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { 
  FileText, 
  Settings, 
  Rocket, 
  Check, 
  Camera,
  Receipt,
  CheckCircle,
  Trophy,
  Target,
  Sparkles,
  Package
} from 'lucide-react';
import RunHUD from './RunHUD';
import ReplayControls from './ReplayControls';
import ConfettiCelebration from './ConfettiCelebration';

const BusinessTab = () => {
  const { t, language } = useLanguage();
  const { state, isReplay, isDayComplete } = useDemo();
  
  const data = state.business;
  if (!data) return null;

  const showTimeline = ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state.uiState);
  const week1Items = data.week1Goals || data.week1 || [];
  
  const showConfetti = isDayComplete && state.timeline.evidenceRevealed.length === 3;

  return (
    <div className="space-y-6">
      <ConfettiCelebration trigger={showConfetti} />
      
      {/* Run HUD */}
      {showTimeline && <RunHUD />}

      {/* Main Content Grid - 3 columns on large screens */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Products & Packages */}
        <div className="glass-card p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('artifact.blueprint.title')}</h3>
              <p className="text-xs text-muted-foreground">{language === 'ru' ? 'Продукты и услуги' : 'Products & Services'}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {data.packages.slice(0, 4).map((pkg, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/60 rounded-xl hover:bg-secondary transition-colors">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground text-sm block truncate">{pkg.name}</span>
                  {pkg.description && <p className="text-xs text-muted-foreground truncate mt-0.5">{pkg.description}</p>}
                </div>
                <span className="font-semibold text-primary text-sm ml-3 shrink-0">{pkg.price}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">{t('artifact.blueprint.target')}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{data.target}</p>
          </div>
        </div>

        {/* Operating System */}
        <div className="glass-card p-5 md:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('artifact.os.title')}</h3>
              <p className="text-xs text-muted-foreground">{language === 'ru' ? 'Структура команды' : 'Team Structure'}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-5">
            {data.roles.slice(0, 5).map((role, i) => (
              <span key={i} className="px-3 py-1.5 bg-secondary rounded-lg text-xs font-medium text-foreground">{role}</span>
            ))}
          </div>

          <div className="space-y-2">
            {Object.entries(data.loops).slice(0, 4).map(([key, value]) => (
              <div key={key} className="p-3 bg-secondary/40 rounded-xl">
                <span className="text-xs font-semibold text-accent uppercase tracking-wide">{key}</span>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Week 1 Goals & Evidence */}
        <div className="glass-card p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t('artifact.launch.title')}</h3>
                <p className="text-xs text-muted-foreground">{language === 'ru' ? 'Первая неделя' : 'Week 1'}</p>
              </div>
            </div>
            {isDayComplete && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-success/10 text-success text-xs font-semibold rounded-full">
                <Trophy className="w-3.5 h-3.5" />
                {state.timeline.evidenceRevealed.length}/3
              </span>
            )}
          </div>

          <div className="space-y-2 mb-5">
            {week1Items.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-success" />
                </div>
                <span className="text-sm text-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">
              {language === 'ru' ? 'Собранные доказательства' : 'Collected Evidence'}
            </p>
            <div className="space-y-2">
              {[
                { icon: Camera, label: t('evidence.booking'), index: 0 },
                { icon: CheckCircle, label: t('evidence.verified'), index: 1 },
                { icon: Receipt, label: t('evidence.payment'), index: 2 },
              ].map((evidence) => {
                const isRevealed = state.timeline.evidenceRevealed.includes(evidence.index);
                return (
                  <div key={evidence.index} className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-500 ${
                    isRevealed ? 'bg-success/10 border border-success/20' : 'bg-secondary/50'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isRevealed ? 'bg-success/20' : 'bg-secondary'
                    }`}>
                      <evidence.icon className={`w-4 h-4 ${isRevealed ? 'text-success' : 'text-muted-foreground'}`} />
                    </div>
                    <span className={`text-sm font-medium flex-1 ${isRevealed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {evidence.label}
                    </span>
                    {isRevealed && (
                      <span className="text-xs text-success font-mono bg-success/10 px-2 py-0.5 rounded-md">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {isDayComplete && state.timeline.evidenceRevealed.length === 3 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-success/10 via-primary/5 to-accent/10 border border-success/20 rounded-xl text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-success">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">{language === 'ru' ? 'Все доказательства собраны!' : 'All proof collected!'}</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>

      {isReplay && <ReplayControls />}
    </div>
  );
};

export default BusinessTab;
