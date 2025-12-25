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
  HelpCircle
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';

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

  return (
    <div className="space-y-6">
      {/* Three Artifact Panels */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Artifact A: Business Blueprint */}
        <div className="glass-card p-5 animate-slide-in-right opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{t('artifact.blueprint.title')}</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">{t('artifact.blueprint.name')}:</span>
              <p className="text-foreground font-medium">{data.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t('artifact.blueprint.offer')}:</span>
              <div className="mt-1 space-y-1">
                {data.packages.map((pkg, i) => (
                  <div key={i} className="flex justify-between text-foreground">
                    <span>{pkg.name}</span>
                    <span className="font-mono text-primary">{pkg.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">{t('artifact.blueprint.target')}:</span>
              <p className="text-foreground">{data.target}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t('artifact.blueprint.channel')}:</span>
              <p className="text-foreground">{data.channel}</p>
            </div>
            <div>
              <span className="text-muted-foreground">{t('artifact.blueprint.week1')}:</span>
              <ul className="mt-1 space-y-1">
                {data.week1.map((item, i) => (
                  <li key={i} className="text-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Artifact B: Operating System */}
        <div className="glass-card p-5 animate-slide-in-right opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{t('artifact.os.title')}</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">{t('artifact.os.roles')}:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {data.roles.map((role, i) => (
                  <span key={i} className="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">
                    {role}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">{t('artifact.os.loops')}:</span>
              <div className="mt-1 space-y-2">
                {Object.entries(data.loops).map(([key, value]) => (
                  <div key={key} className="text-foreground">
                    <span className="text-primary font-medium capitalize">{t(`artifact.os.loop.${key}` as TranslationKey)}:</span>
                    <span className="ml-2 text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">{t('artifact.os.policies')}:</span>
              <ul className="mt-1 space-y-1">
                {data.policies.map((policy, i) => (
                  <li key={i} className="text-foreground flex items-start gap-2">
                    <span className="text-accent">⚡</span>
                    {policy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Artifact C: Launch & Proof */}
        <div className="glass-card p-5 animate-slide-in-right opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{t('artifact.launch.title')}</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">{t('artifact.launch.readiness')}:</span>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-success">
                  <Check className="w-4 h-4" />
                  <span>{t('artifact.launch.inbox.ready')}</span>
                </div>
                <div className="flex items-center gap-2 text-success">
                  <Check className="w-4 h-4" />
                  <span>{t('artifact.launch.calendar.ready')}</span>
                </div>
                <div className="flex items-center gap-2 text-success">
                  <Check className="w-4 h-4" />
                  <span>{t('artifact.launch.payments.ready')}</span>
                </div>
              </div>
            </div>

            {/* Evidence Trophies */}
            {evidenceRevealed.length > 0 && (
              <div className="pt-3 border-t border-border/50">
                <span className="text-muted-foreground">{t('artifact.launch.evidence')}:</span>
                <div className="mt-2 space-y-2">
                  {evidenceRevealed.includes(0) && (
                    <div className="trophy-enter flex items-center gap-2 text-foreground bg-success/10 px-2 py-1 rounded">
                      <Camera className="w-4 h-4 text-success" />
                      <span>{t('evidence.booking')}</span>
                    </div>
                  )}
                  {evidenceRevealed.includes(1) && (
                    <div className="trophy-enter flex items-center gap-2 text-foreground bg-success/10 px-2 py-1 rounded">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span>{t('evidence.verified')}</span>
                    </div>
                  )}
                  {evidenceRevealed.includes(2) && (
                    <div className="trophy-enter flex items-center gap-2 text-foreground bg-success/10 px-2 py-1 rounded">
                      <Receipt className="w-4 h-4 text-success" />
                      <span>{t('evidence.payment')}</span>
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
        <div className="glass-card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {t('timeline.title')}
            </h3>
            <span className="font-mono text-sm text-muted-foreground">
              {Math.round(timelineProgress)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-6">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{ width: `${timelineProgress}%` }}
              />
            </div>
            
            {/* Event markers */}
            <div className="absolute inset-x-0 top-0 h-2 pointer-events-none">
              {TIMELINE_EVENTS.map((event, i) => (
                <div
                  key={i}
                  className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors ${
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

          {/* Events List */}
          <div className="space-y-2">
            {TIMELINE_EVENTS.map((event, i) => {
              const isActive = i === currentEventIndex;
              const isPast = event.progress <= timelineProgress;
              const isDecisionEvent = event.isBossDecision;
              
              return (
                <div 
                  key={i}
                  className={`flex items-center gap-3 p-2 rounded transition-colors ${
                    isActive ? 'bg-primary/10' : ''
                  }`}
                >
                  <span className={`font-mono text-xs w-12 ${isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {event.time}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    isPast 
                      ? isDecisionEvent ? 'bg-accent' : 'bg-success' 
                      : 'bg-muted'
                  }`} />
                  <span className={`flex-1 text-sm ${isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {t(event.key)}
                  </span>
                  
                  {/* Decision result indicator */}
                  {isDecisionEvent && decisionMade && isPast && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      decisionMade === 'approve' ? 'bg-success/20 text-success' :
                      decisionMade === 'deny' ? 'bg-destructive/20 text-destructive' :
                      'bg-accent/20 text-accent'
                    }`}>
                      {decisionMade === 'approve' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                      {decisionMade === 'deny' && <XCircle className="w-3 h-3 inline mr-1" />}
                      {decisionMade === 'photo' && <HelpCircle className="w-3 h-3 inline mr-1" />}
                      {decisionMade === 'approve' ? (language === 'ru' ? 'Одобрено' : 'Approved') :
                       decisionMade === 'deny' ? (language === 'ru' ? 'Отклонено' : 'Denied') :
                       (language === 'ru' ? 'Фото запрошено' : 'Photo requested')}
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
