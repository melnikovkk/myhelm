import { useLanguage } from '@/hooks/useLanguage';
import { TranslationKey } from '@/lib/translations';
import type { BusinessData, SimulatorState } from './BusinessSimulator';
import { 
  FileText, 
  Settings, 
  Rocket, 
  Check, 
  Clock,
  Camera,
  Receipt,
  CheckCircle,
  XCircle,
  HelpCircle,
  Trophy,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import RunHUD from './RunHUD';

// Timeline events
const TIMELINE_EVENTS = [
  { time: '09:00', key: 'timeline.09:00' as TranslationKey, progress: 0 },
  { time: '10:00', key: 'timeline.10:00' as TranslationKey, progress: 12.5 },
  { time: '12:00', key: 'timeline.12:00' as TranslationKey, progress: 37.5 },
  { time: '14:00', key: 'timeline.14:00' as TranslationKey, progress: 62.5 },
  { time: '15:00', key: 'timeline.15:00' as TranslationKey, progress: 75 },
  { time: '15:30', key: 'timeline.15:30' as TranslationKey, progress: 81.25, isBossDecision: true },
  { time: '16:00', key: 'timeline.16:00' as TranslationKey, progress: 87.5 },
  { time: '17:00', key: 'timeline.17:00' as TranslationKey, progress: 100 },
];

interface BusinessTabProps {
  data: BusinessData;
  state: SimulatorState;
  timelineProgress: number;
  currentEventIndex: number;
  decisionMade: 'approve' | 'deny' | 'photo' | null;
  evidenceRevealed: number[];
  onScrub: (progress: number) => void;
}

const BusinessTab = ({ 
  data, 
  state, 
  timelineProgress, 
  currentEventIndex,
  decisionMade,
  evidenceRevealed,
  onScrub 
}: BusinessTabProps) => {
  const { t, language } = useLanguage();
  const showTimeline = ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state);
  const isReplay = state === 'REPLAY';

  // For fog-of-war effect in replay
  const getFogClass = (elementProgress: number) => {
    if (!isReplay) return '';
    const isVisible = Math.abs(timelineProgress - elementProgress) < 20;
    return isVisible ? 'fog-visible' : 'fog-hidden';
  };

  const week1Items = data.week1Goals || data.week1 || [];

  return (
    <div className="space-y-6">
      {/* Business Header with Name & Tagline */}
      <div className="glass-card p-4 md:p-6 rounded-xl border-primary/20 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{data.name}</h2>
            {data.tagline && (
              <p className="text-sm text-muted-foreground mt-1">{data.tagline}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {data.channel}
            </span>
          </div>
        </div>
      </div>

      {/* Run HUD - gamified command center */}
      <RunHUD
        state={state}
        timelineProgress={timelineProgress}
        currentEventIndex={currentEventIndex}
        decisionMade={decisionMade}
        isReplay={isReplay}
      />

      {/* Three Artifact Panels - Improved Layout */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Artifact A: Products & Pricing */}
        <div className="glass-card p-5 rounded-xl animate-slide-in-right opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('artifact.blueprint.title')}</h3>
              <p className="text-xs text-muted-foreground">{language === 'ru' ? 'Продукты и цены' : 'Products & Pricing'}</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm">
            {/* Packages */}
            <div className="space-y-2">
              {data.packages.map((pkg, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                  <div>
                    <span className="font-medium text-foreground">{pkg.name}</span>
                    {pkg.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{pkg.description}</p>
                    )}
                  </div>
                  <span className="font-mono text-primary font-semibold">{pkg.price}</span>
                </div>
              ))}
            </div>

            {/* Target */}
            <div className="pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Target className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{t('artifact.blueprint.target')}</span>
              </div>
              <p className="text-foreground text-sm">{data.target}</p>
            </div>
          </div>
        </div>

        {/* Artifact B: Operating System */}
        <div className="glass-card p-5 rounded-xl animate-slide-in-right opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('artifact.os.title')}</h3>
              <p className="text-xs text-muted-foreground">{language === 'ru' ? 'Автоматизация' : 'Automation'}</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm">
            {/* Roles */}
            <div className="flex flex-wrap gap-1.5">
              {data.roles.map((role, i) => (
                <span key={i} className="px-2 py-1 bg-secondary/80 rounded-md text-xs text-foreground">
                  {role}
                </span>
              ))}
            </div>

            {/* Loops */}
            <div className="space-y-2">
              {Object.entries(data.loops).map(([key, value]) => (
                <div key={key} className="p-2 bg-secondary/30 rounded-lg">
                  <span className="text-xs font-medium text-accent capitalize">{t(`artifact.os.loop.${key}` as TranslationKey)}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Artifact C: Launch & Proof */}
        <div className="glass-card p-5 rounded-xl animate-slide-in-right opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('artifact.launch.title')}</h3>
              <p className="text-xs text-muted-foreground">{language === 'ru' ? 'Первая неделя' : 'Week 1 Goals'}</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm">
            {/* Week 1 Goals */}
            {week1Items.length > 0 && (
              <div className="space-y-2">
                {week1Items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-foreground">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* KPIs if available */}
            {data.kpis && data.kpis.length > 0 && (
              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">KPIs</span>
                </div>
                <div className="space-y-1">
                  {data.kpis.slice(0, 3).map((kpi, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3 text-accent" />
                      <span>{kpi}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            <div className="pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground font-medium">{t('artifact.os.policies')}:</span>
              <div className="mt-2 space-y-1">
                {data.policies.slice(0, 3).map((policy, i) => (
                  <div key={i} className="text-xs text-foreground flex items-start gap-2">
                    <span className="text-accent">⚡</span>
                    {policy}
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Trophies */}
            {evidenceRevealed.length > 0 && (
              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground font-medium">{t('artifact.launch.evidence')}:</span>
                </div>
                <div className="space-y-2">
                  {evidenceRevealed.includes(0) && (
                    <div className={`trophy-enter flex items-center gap-2 text-foreground bg-success/10 px-3 py-2 rounded-lg border border-success/20 ${isReplay ? getFogClass(87.5) : ''}`}>
                      <Camera className="w-4 h-4 text-success" />
                      <span className="flex-1 text-xs">{t('evidence.booking')}</span>
                      <span className="text-xs text-success font-medium">+1</span>
                    </div>
                  )}
                  {evidenceRevealed.includes(1) && (
                    <div className={`trophy-enter flex items-center gap-2 text-foreground bg-success/10 px-3 py-2 rounded-lg border border-success/20 ${isReplay ? getFogClass(93) : ''}`}>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="flex-1 text-xs">{t('evidence.verified')}</span>
                      <span className="text-xs text-success font-medium">+1</span>
                    </div>
                  )}
                  {evidenceRevealed.includes(2) && (
                    <div className={`trophy-enter flex items-center gap-2 text-foreground bg-success/10 px-3 py-2 rounded-lg border border-success/20 ${isReplay ? getFogClass(100) : ''}`}>
                      <Receipt className="w-4 h-4 text-success" />
                      <span className="flex-1 text-xs">{t('evidence.payment')}</span>
                      <span className="text-xs text-success font-medium">+1</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline */}
      {showTimeline && (
        <div className="glass-card p-5 rounded-xl animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {t('timeline.title')}
            </h3>
            <span className="font-mono text-sm text-primary bg-primary/10 px-2 py-0.5 rounded">
              {Math.round(timelineProgress)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-6">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-100 ease-linear"
                style={{ width: `${timelineProgress}%` }}
              />
            </div>
            
            {/* Event markers */}
            <div className="absolute inset-x-0 top-0 h-2 pointer-events-none">
              {TIMELINE_EVENTS.map((event, i) => (
                <div
                  key={i}
                  className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-background transition-colors ${
                    event.progress <= timelineProgress 
                      ? event.isBossDecision ? 'bg-accent' : 'bg-primary'
                      : 'bg-muted'
                  }`}
                  style={{ left: `${event.progress}%`, transform: 'translate(-50%, -50%)' }}
                />
              ))}
            </div>
          </div>

          {/* Scrubber for REPLAY */}
          {state === 'REPLAY' && (
            <div className="mb-6">
              <Slider
                value={[timelineProgress]}
                onValueChange={([v]) => onScrub(v)}
                max={100}
                step={1}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {t('replay.scrubber')}
              </p>
            </div>
          )}

          {/* Events List - Compact Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {TIMELINE_EVENTS.map((event, i) => {
              const isActive = i === currentEventIndex;
              const isPast = event.progress <= timelineProgress;
              const isDecisionEvent = event.isBossDecision;
              
              return (
                <div 
                  key={i}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all text-xs ${
                    isActive ? 'bg-primary/10 ring-1 ring-primary/30' : isPast ? 'bg-secondary/50' : 'bg-secondary/20'
                  }`}
                >
                  <span className={`font-mono ${isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {event.time}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    isPast 
                      ? isDecisionEvent ? 'bg-accent' : 'bg-success' 
                      : 'bg-muted'
                  }`} />
                  
                  {/* Decision result indicator */}
                  {isDecisionEvent && decisionMade && isPast && (
                    <span className={`ml-auto ${
                      decisionMade === 'approve' ? 'text-success' :
                      decisionMade === 'deny' ? 'text-destructive' :
                      'text-accent'
                    }`}>
                      {decisionMade === 'approve' && <CheckCircle className="w-3.5 h-3.5" />}
                      {decisionMade === 'deny' && <XCircle className="w-3.5 h-3.5" />}
                      {decisionMade === 'photo' && <HelpCircle className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessTab;
