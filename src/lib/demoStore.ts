// HELM Demo Session Store
// Centralized state management with event sourcing for deterministic replay

import { RegionConfig, IndustryConfig, REGIONS, INDUSTRIES } from './regionData';

// ========================
// Types
// ========================

export type DemoMode = 'zero' | 'digitize';
export type Language = 'en' | 'ru';

export type UIState = 
  | 'EMPTY'      // 0: No prompt
  | 'TYPED'      // 1: Prompt ready, can launch
  | 'LAUNCHING'  // 2: Generating artifacts
  | 'ARTIFACTS'  // 3: Artifacts ready, can run test day
  | 'RUNNING'    // 4: Timeline progressing
  | 'DECISION'   // 5: Boss decision required (blocks timeline)
  | 'DECIDED'    // 6: Decision made, resuming
  | 'EVIDENCE'   // 7: Evidence dropping
  | 'REPLAY';    // 8: Complete, can scrub/edit

export type DecisionType = 'approve' | 'deny' | 'photo';

export interface BusinessData {
  name: string;
  tagline?: string;
  packages: { name: string; price: string; description?: string }[];
  target: string;
  channel: string;
  week1Goals?: string[];
  week1?: string[];
  roles: string[];
  loops: {
    sell: string;
    deliver: string;
    money: string;
    support: string;
  };
  policies: string[];
  kpis?: string[];
  isDigitize?: boolean;
  migrationPlan?: string[];
  automations?: string[];
  beforeAfter?: { before: string; after: string }[];
}

export interface TimelineState {
  progress: number;           // 0-100
  currentEventIndex: number;  // -1 to 7
  isPaused: boolean;
  decisionMade: DecisionType | null;
  evidenceRevealed: number[]; // indices of revealed evidence
}

export interface RequestState {
  activeRequestId: string | null;
  abortController: AbortController | null;
}

// ========================
// Event Log (Event Sourcing)
// ========================

export type DemoEvent = 
  | { type: 'SESSION_STARTED'; timestamp: number; language: Language }
  | { type: 'LANGUAGE_CHANGED'; timestamp: number; language: Language }
  | { type: 'REGION_SELECTED'; timestamp: number; regionCode: string }
  | { type: 'INDUSTRY_SELECTED'; timestamp: number; industryKey: string }
  | { type: 'MODE_SELECTED'; timestamp: number; mode: DemoMode }
  | { type: 'PROMPT_SET'; timestamp: number; prompt: string; source: 'generated' | 'edited' | 'canon' }
  | { type: 'PROMPT_CLEARED'; timestamp: number }
  | { type: 'LAUNCH_REQUESTED'; timestamp: number; requestId: string }
  | { type: 'LAUNCH_COMPLETED'; timestamp: number; requestId: string; artifacts: BusinessData }
  | { type: 'LAUNCH_FAILED'; timestamp: number; requestId: string; error: string }
  | { type: 'LAUNCH_CANCELED'; timestamp: number; requestId: string }
  | { type: 'TESTDAY_STARTED'; timestamp: number }
  | { type: 'TESTDAY_TICK'; timestamp: number; progress: number; eventIndex: number }
  | { type: 'TESTDAY_PAUSED'; timestamp: number; reason: 'decision' | 'manual' }
  | { type: 'TESTDAY_RESUMED'; timestamp: number }
  | { type: 'TESTDAY_ENDED'; timestamp: number }
  | { type: 'DECISION_OPENED'; timestamp: number }
  | { type: 'DECISION_MADE'; timestamp: number; decision: DecisionType }
  | { type: 'EVIDENCE_GRANTED'; timestamp: number; index: number }
  | { type: 'REPLAY_SCRUBBED'; timestamp: number; progress: number }
  | { type: 'EDIT_REQUESTED'; timestamp: number }
  | { type: 'START_OVER'; timestamp: number };

// ========================
// Session State
// ========================

export interface DemoSession {
  // Core identity
  language: Language;
  mode: DemoMode;
  
  // Context
  region: RegionConfig | null;
  industry: IndustryConfig | null;
  
  // Prompt
  prompt: string;
  promptSource: 'generated' | 'edited' | 'canon' | null;
  isEditing: boolean;
  
  // UI State
  uiState: UIState;
  
  // Business artifacts
  business: BusinessData | null;
  
  // Timeline
  timeline: TimelineState;
  
  // Requests (not persisted)
  requests: {
    launch: RequestState;
    reality: RequestState;
    competitor: RequestState;
  };
  
  // Error state
  error: string | null;
  
  // Event log
  eventLog: DemoEvent[];
}

// ========================
// Initial State Factory
// ========================

export function createInitialSession(language: Language = 'en'): DemoSession {
  return {
    language,
    mode: 'zero',
    region: REGIONS.find(r => r.code === 'DE') || REGIONS[0],
    industry: INDUSTRIES.find(i => i.key === 'service') || INDUSTRIES[0],
    prompt: '',
    promptSource: null,
    isEditing: false,
    uiState: 'EMPTY',
    business: null,
    timeline: {
      progress: 0,
      currentEventIndex: -1,
      isPaused: false,
      decisionMade: null,
      evidenceRevealed: [],
    },
    requests: {
      launch: { activeRequestId: null, abortController: null },
      reality: { activeRequestId: null, abortController: null },
      competitor: { activeRequestId: null, abortController: null },
    },
    error: null,
    eventLog: [{ type: 'SESSION_STARTED', timestamp: Date.now(), language }],
  };
}

// ========================
// Actions
// ========================

export type DemoAction =
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'SET_REGION'; region: RegionConfig }
  | { type: 'SET_INDUSTRY'; industry: IndustryConfig }
  | { type: 'SET_MODE'; mode: DemoMode }
  | { type: 'SET_PROMPT'; prompt: string; source: 'generated' | 'edited' | 'canon' }
  | { type: 'CLEAR_PROMPT' }
  | { type: 'SET_EDITING'; isEditing: boolean }
  | { type: 'START_LAUNCH'; requestId: string; abortController: AbortController }
  | { type: 'COMPLETE_LAUNCH'; requestId: string; artifacts: BusinessData }
  | { type: 'FAIL_LAUNCH'; requestId: string; error: string }
  | { type: 'CANCEL_LAUNCH'; requestId: string }
  | { type: 'START_TESTDAY' }
  | { type: 'TICK_TIMELINE'; progress: number; eventIndex: number }
  | { type: 'PAUSE_TIMELINE'; reason: 'decision' | 'manual' }
  | { type: 'RESUME_TIMELINE' }
  | { type: 'END_TESTDAY' }
  | { type: 'OPEN_DECISION' }
  | { type: 'MAKE_DECISION'; decision: DecisionType }
  | { type: 'GRANT_EVIDENCE'; index: number }
  | { type: 'SCRUB_REPLAY'; progress: number }
  | { type: 'REQUEST_EDIT' }
  | { type: 'START_OVER' }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESTORE_SESSION'; session: Partial<DemoSession> };

// ========================
// Reducer
// ========================

export function demoReducer(state: DemoSession, action: DemoAction): DemoSession {
  const timestamp = Date.now();
  
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.language,
        eventLog: [...state.eventLog, { type: 'LANGUAGE_CHANGED', timestamp, language: action.language }],
      };
      
    case 'SET_REGION':
      return {
        ...state,
        region: action.region,
        eventLog: [...state.eventLog, { type: 'REGION_SELECTED', timestamp, regionCode: action.region.code }],
      };
      
    case 'SET_INDUSTRY':
      return {
        ...state,
        industry: action.industry,
        eventLog: [...state.eventLog, { type: 'INDUSTRY_SELECTED', timestamp, industryKey: action.industry.key }],
      };
      
    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
        eventLog: [...state.eventLog, { type: 'MODE_SELECTED', timestamp, mode: action.mode }],
      };
      
    case 'SET_PROMPT': {
      const newUIState = action.prompt.length >= 10 ? 'TYPED' : 'EMPTY';
      return {
        ...state,
        prompt: action.prompt,
        promptSource: action.source,
        uiState: newUIState,
        isEditing: false,
        eventLog: [...state.eventLog, { type: 'PROMPT_SET', timestamp, prompt: action.prompt, source: action.source }],
      };
    }
      
    case 'CLEAR_PROMPT':
      return {
        ...state,
        prompt: '',
        promptSource: null,
        uiState: 'EMPTY',
        isEditing: false,
        eventLog: [...state.eventLog, { type: 'PROMPT_CLEARED', timestamp }],
      };
      
    case 'SET_EDITING':
      return {
        ...state,
        isEditing: action.isEditing,
      };
      
    case 'START_LAUNCH':
      return {
        ...state,
        uiState: 'LAUNCHING',
        error: null,
        requests: {
          ...state.requests,
          launch: { activeRequestId: action.requestId, abortController: action.abortController },
        },
        eventLog: [...state.eventLog, { type: 'LAUNCH_REQUESTED', timestamp, requestId: action.requestId }],
      };
      
    case 'COMPLETE_LAUNCH':
      // Only accept if requestId matches
      if (state.requests.launch.activeRequestId !== action.requestId) {
        return state; // Stale response, ignore
      }
      return {
        ...state,
        uiState: 'ARTIFACTS',
        business: action.artifacts,
        requests: {
          ...state.requests,
          launch: { activeRequestId: null, abortController: null },
        },
        eventLog: [...state.eventLog, { type: 'LAUNCH_COMPLETED', timestamp, requestId: action.requestId, artifacts: action.artifacts }],
      };
      
    case 'FAIL_LAUNCH':
      if (state.requests.launch.activeRequestId !== action.requestId) {
        return state;
      }
      return {
        ...state,
        uiState: 'TYPED',
        error: action.error,
        requests: {
          ...state.requests,
          launch: { activeRequestId: null, abortController: null },
        },
        eventLog: [...state.eventLog, { type: 'LAUNCH_FAILED', timestamp, requestId: action.requestId, error: action.error }],
      };
      
    case 'CANCEL_LAUNCH':
      state.requests.launch.abortController?.abort();
      return {
        ...state,
        uiState: state.prompt.length >= 10 ? 'TYPED' : 'EMPTY',
        requests: {
          ...state.requests,
          launch: { activeRequestId: null, abortController: null },
        },
        eventLog: [...state.eventLog, { type: 'LAUNCH_CANCELED', timestamp, requestId: action.requestId }],
      };
      
    case 'START_TESTDAY':
      return {
        ...state,
        uiState: 'RUNNING',
        timeline: {
          progress: 0,
          currentEventIndex: -1,
          isPaused: false,
          decisionMade: null,
          evidenceRevealed: [],
        },
        eventLog: [...state.eventLog, { type: 'TESTDAY_STARTED', timestamp }],
      };
      
    case 'TICK_TIMELINE':
      return {
        ...state,
        timeline: {
          ...state.timeline,
          progress: action.progress,
          currentEventIndex: action.eventIndex,
        },
        eventLog: [...state.eventLog, { type: 'TESTDAY_TICK', timestamp, progress: action.progress, eventIndex: action.eventIndex }],
      };
      
    case 'PAUSE_TIMELINE':
      return {
        ...state,
        timeline: {
          ...state.timeline,
          isPaused: true,
        },
        eventLog: [...state.eventLog, { type: 'TESTDAY_PAUSED', timestamp, reason: action.reason }],
      };
      
    case 'RESUME_TIMELINE':
      return {
        ...state,
        uiState: 'RUNNING',
        timeline: {
          ...state.timeline,
          isPaused: false,
        },
        eventLog: [...state.eventLog, { type: 'TESTDAY_RESUMED', timestamp }],
      };
      
    case 'END_TESTDAY':
      return {
        ...state,
        uiState: 'EVIDENCE',
        timeline: {
          ...state.timeline,
          progress: 100,
          isPaused: false,
        },
        eventLog: [...state.eventLog, { type: 'TESTDAY_ENDED', timestamp }],
      };
      
    case 'OPEN_DECISION':
      return {
        ...state,
        uiState: 'DECISION',
        timeline: {
          ...state.timeline,
          isPaused: true,
        },
        eventLog: [...state.eventLog, { type: 'DECISION_OPENED', timestamp }],
      };
      
    case 'MAKE_DECISION':
      return {
        ...state,
        uiState: 'DECIDED',
        timeline: {
          ...state.timeline,
          decisionMade: action.decision,
        },
        eventLog: [...state.eventLog, { type: 'DECISION_MADE', timestamp, decision: action.decision }],
      };
      
    case 'GRANT_EVIDENCE':
      if (state.timeline.evidenceRevealed.includes(action.index)) {
        return state;
      }
      return {
        ...state,
        timeline: {
          ...state.timeline,
          evidenceRevealed: [...state.timeline.evidenceRevealed, action.index],
        },
        eventLog: [...state.eventLog, { type: 'EVIDENCE_GRANTED', timestamp, index: action.index }],
      };
      
    case 'SCRUB_REPLAY': {
      // Derive evidence from progress
      const newEvidence: number[] = [];
      if (action.progress >= 87.5) newEvidence.push(0);
      if (action.progress >= 93) newEvidence.push(1);
      if (action.progress >= 100) newEvidence.push(2);
      
      // Derive event index
      const TIMELINE_PROGRESS = [0, 12.5, 37.5, 62.5, 75, 81.25, 87.5, 100];
      const eventIndex = TIMELINE_PROGRESS.findIndex(p => p > action.progress) - 1;
      
      // If scrubbing before decision point (81.25%), reset decisionMade visually
      // But keep the actual decision in eventLog for true replay
      const showDecision = action.progress >= 81.25;
      
      return {
        ...state,
        timeline: {
          ...state.timeline,
          progress: action.progress,
          currentEventIndex: Math.max(0, eventIndex),
          evidenceRevealed: newEvidence,
          // Don't reset decisionMade - it's historical. Just control display via progress.
        },
        eventLog: [...state.eventLog, { type: 'REPLAY_SCRUBBED', timestamp, progress: action.progress }],
      };
    }
      
    case 'REQUEST_EDIT':
      return {
        ...state,
        uiState: 'TYPED',
        isEditing: true,
        eventLog: [...state.eventLog, { type: 'EDIT_REQUESTED', timestamp }],
      };
      
    case 'START_OVER': {
      // Cancel any active requests
      state.requests.launch.abortController?.abort();
      state.requests.reality.abortController?.abort();
      state.requests.competitor.abortController?.abort();
      
      return {
        ...createInitialSession(state.language),
        region: state.region,
        industry: state.industry,
        eventLog: [...state.eventLog, { type: 'START_OVER', timestamp }],
      };
    }
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
      };
      
    case 'RESTORE_SESSION':
      return {
        ...state,
        ...action.session,
        // Never restore request state
        requests: state.requests,
      };
      
    default:
      return state;
  }
}

// ========================
// Persistence
// ========================

const STORAGE_KEY = 'helm-demo-session';

export function persistSession(session: DemoSession): void {
  try {
    // Don't persist request state or full event log (too large)
    const toPersist = {
      language: session.language,
      mode: session.mode,
      region: session.region,
      industry: session.industry,
      prompt: session.prompt,
      promptSource: session.promptSource,
      uiState: session.uiState,
      business: session.business,
      timeline: session.timeline,
      // Keep last 50 events only
      eventLog: session.eventLog.slice(-50),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  } catch {
    // Ignore storage errors
  }
}

export function loadSession(): Partial<DemoSession> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // If was in a running state, pause it
    if (['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE'].includes(parsed.uiState)) {
      parsed.uiState = 'ARTIFACTS';
      if (parsed.timeline) {
        parsed.timeline.isPaused = true;
      }
    }
    
    return parsed;
  } catch {
    return null;
  }
}

export function clearPersistedSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

// ========================
// Request ID Generator
// ========================

export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ========================
// Selectors
// ========================

export const selectors = {
  isLaunchEnabled: (s: DemoSession) => s.prompt.length >= 10 && s.uiState !== 'LAUNCHING',
  canRunTestDay: (s: DemoSession) => s.uiState === 'ARTIFACTS' || s.uiState === 'REPLAY',
  isRunning: (s: DemoSession) => ['RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE'].includes(s.uiState),
  showSimulator: (s: DemoSession) => ['LAUNCHING', 'ARTIFACTS', 'RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(s.uiState),
  showWizard: (s: DemoSession) => s.uiState === 'EMPTY' && !s.prompt,
  isReplay: (s: DemoSession) => s.uiState === 'REPLAY',
  isDayComplete: (s: DemoSession) => s.uiState === 'EVIDENCE' || s.uiState === 'REPLAY',
};
