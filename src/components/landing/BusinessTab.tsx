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
  Sparkles
} from 'lucide-react';
import RunHUD from './RunHUD';
import ReplayControls from './ReplayControls';
import ConfettiCelebration from './ConfettiCelebration';

const BusinessTab = () => {
  const { t, language } = useLanguage();
  const { state, isReplay, isDayComplete, actions } = useDemo();
  
  const data = state.business;
  if (!data) return null;

  const showTimeline = ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state.uiState);
  const week1Items = data.week1Goals || data.week1 || [];
  
  // Trigger confetti when all evidence is revealed
  const showConfetti = isDayComplete && state.timeline.evidenceRevealed.length === 3;

  return (
    <div className="space-y-4">
      {/* Confetti celebration */}
      <ConfettiCelebration trigger={showConfetti} />
      
      {/* Run HUD */}
      {showTimeline && <RunHUD />}
      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Left Column: Products & Target */}
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{t('artifact.blueprint.title')}</h3>
          </div>
          
          <div className="space-y-2 mb-4">
            {data.packages.slice(0, 3).map((pkg, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground text-sm truncate block">{pkg.name}</span>
                  {pkg.description && <p className="text-xs text-muted-foreground truncate">{pkg.description}</p>}
                </div>
                <span className="font-mono text-primary font-semibold text-sm ml-3">{pkg.price}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{t('artifact.blueprint.target')}</span>
            </div>
            <p className="text-sm text-foreground">{data.target}</p>
          </div>
        </div>

        {/* Right Column: Operating System */}
        <div className="glass-card p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">{t('artifact.os.title')}</h3>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mb-4">
            {data.roles.slice(0, 4).map((role, i) => (
              <span key={i} className="px-2 py-1 bg-secondary/60 rounded text-xs text-foreground">{role}</span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.loops).slice(0, 4).map(([key, value]) => (
              <div key={key} className="p-2 bg-secondary/30 rounded-lg">
                <span className="text-[10px] font-medium text-accent uppercase">{key}</span>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Week 1 Goals & Evidence */}
      <div className="glass-card p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">{t('artifact.launch.title')}</h3>
          </div>
          {isDayComplete && (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
              <Trophy className="w-3.5 h-3.5" />
              {state.timeline.evidenceRevealed.length}/3
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2">
              {language === 'ru' ? 'Цели первой недели' : 'Week 1 Goals'}
            </p>
            <div className="space-y-1.5">
              {week1Items.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  <span className="line-clamp-1">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground font-medium mb-2">
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
                  <div key={evidence.index} className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-500 ${isRevealed ? 'bg-success/10 border border-success/20' : 'bg-secondary/30 opacity-50'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isRevealed ? 'bg-success/20' : 'bg-secondary'}`}>
                      <evidence.icon className={`w-3.5 h-3.5 ${isRevealed ? 'text-success' : 'text-muted-foreground'}`} />
                    </div>
                    <span className={`text-xs font-medium ${isRevealed ? 'text-foreground' : 'text-muted-foreground'}`}>{evidence.label}</span>
                    {isRevealed && <span className="ml-auto text-xs text-success font-mono bg-success/10 px-1.5 py-0.5 rounded">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {isDayComplete && state.timeline.evidenceRevealed.length === 3 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-success/10 to-accent/10 border border-success/20 rounded-lg text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 text-success">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">{language === 'ru' ? 'Все доказательства собраны!' : 'All proof collected!'}</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Replay Controls */}
      {isReplay && <ReplayControls />}
    </div>
  );
};

export default BusinessTab;
