// HELM Demo Context Provider
// Provides centralized state management for the demo

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import {
  DemoSession,
  DemoAction,
  demoReducer,
  createInitialSession,
  persistSession,
  loadSession,
  generateRequestId,
  selectors,
  BusinessData,
  DecisionType,
  DemoMode,
} from '@/lib/demoStore';
import { RegionConfig, IndustryConfig } from '@/lib/regionData';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ========================
// Context Types
// ========================

interface DemoContextValue {
  state: DemoSession;
  dispatch: React.Dispatch<DemoAction>;
  
  // Computed selectors
  isLaunchEnabled: boolean;
  canRunTestDay: boolean;
  isRunning: boolean;
  showSimulator: boolean;
  showWizard: boolean;
  isReplay: boolean;
  isDayComplete: boolean;
  
  // Action helpers (with double-click protection)
  actions: {
    setRegion: (region: RegionConfig) => void;
    setIndustry: (industry: IndustryConfig) => void;
    setMode: (mode: DemoMode) => void;
    setPrompt: (prompt: string, source: 'generated' | 'edited' | 'canon') => void;
    clearPrompt: () => void;
    setEditing: (isEditing: boolean) => void;
    launch: () => Promise<void>;
    cancelLaunch: () => void;
    startTestDay: () => void;
    makeDecision: (decision: DecisionType) => void;
    scrubReplay: (progress: number) => void;
    requestEdit: () => void;
    startOver: () => void;
  };
}

const DemoContext = createContext<DemoContextValue | null>(null);

// ========================
// Timeline Events
// ========================

const TIMELINE_EVENTS = [
  { time: '09:00', progress: 0 },
  { time: '10:00', progress: 12.5 },
  { time: '12:00', progress: 37.5 },
  { time: '14:00', progress: 62.5 },
  { time: '15:00', progress: 75 },
  { time: '15:30', progress: 81.25, isBossDecision: true },
  { time: '16:00', progress: 87.5 },
  { time: '17:00', progress: 100 },
];

// ========================
// Provider Component
// ========================

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  
  // Initialize with language from context
  const [state, dispatch] = useReducer(demoReducer, null, () => {
    const saved = loadSession();
    if (saved) {
      return { ...createInitialSession(language), ...saved };
    }
    return createInitialSession(language);
  });
  
  // Refs for timeline interval and action locks
  const timelineIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLaunchingRef = useRef(false);
  const isRunningTestDayRef = useRef(false);
  
  // Sync language changes
  useEffect(() => {
    if (state.language !== language) {
      dispatch({ type: 'SET_LANGUAGE', language });
    }
  }, [language, state.language]);
  
  // Persist on state changes
  useEffect(() => {
    persistSession(state);
  }, [state]);
  
  // Timeline management
  useEffect(() => {
    // Clear existing interval
    if (timelineIntervalRef.current) {
      clearInterval(timelineIntervalRef.current);
      timelineIntervalRef.current = null;
    }
    
    // Only run if in RUNNING state
    if (state.uiState !== 'RUNNING') {
      isRunningTestDayRef.current = false;
      return;
    }
    
    isRunningTestDayRef.current = true;
    
    timelineIntervalRef.current = setInterval(() => {
      const currentProgress = state.timeline.progress;
      const nextProgress = currentProgress + 0.5;
      
      // Find current event index
      const eventIndex = TIMELINE_EVENTS.findIndex(e => e.progress > nextProgress) - 1;
      
      // Check for boss decision
      if (eventIndex >= 0) {
        const currentEvent = TIMELINE_EVENTS[eventIndex];
        if (currentEvent?.isBossDecision && !state.timeline.decisionMade) {
          // Pause at decision point
          dispatch({ type: 'OPEN_DECISION' });
          return;
        }
      }
      
      // Check for completion
      if (nextProgress >= 100) {
        dispatch({ type: 'END_TESTDAY' });
        return;
      }
      
      // Normal tick
      dispatch({ type: 'TICK_TIMELINE', progress: nextProgress, eventIndex: Math.max(0, eventIndex) });
    }, 100);
    
    return () => {
      if (timelineIntervalRef.current) {
        clearInterval(timelineIntervalRef.current);
        timelineIntervalRef.current = null;
      }
    };
  }, [state.uiState, state.timeline.progress, state.timeline.decisionMade]);
  
  // Evidence reveal after testday ends
  useEffect(() => {
    if (state.uiState !== 'EVIDENCE') return;
    
    const timers = [0, 1, 2].map((i) =>
      setTimeout(() => {
        dispatch({ type: 'GRANT_EVIDENCE', index: i });
      }, i * 400)
    );
    
    const replayTimer = setTimeout(() => {
      dispatch({ type: 'RESTORE_SESSION', session: { uiState: 'REPLAY' } });
    }, 2000);
    
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(replayTimer);
    };
  }, [state.uiState]);
  
  // Resume timeline after decision
  useEffect(() => {
    if (state.uiState !== 'DECIDED') return;
    
    const resumeTimer = setTimeout(() => {
      dispatch({ type: 'RESUME_TIMELINE' });
    }, 500);
    
    return () => clearTimeout(resumeTimer);
  }, [state.uiState]);
  
  // ========================
  // Action Helpers
  // ========================
  
  const launch = useCallback(async () => {
    // Double-click protection
    if (isLaunchingRef.current) return;
    if (!selectors.isLaunchEnabled(state)) return;
    
    isLaunchingRef.current = true;
    
    const requestId = generateRequestId();
    const abortController = new AbortController();
    
    dispatch({ type: 'START_LAUNCH', requestId, abortController });
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-artifacts', {
        body: {
          prompt: state.prompt,
          locale: state.language,
          mode: state.mode,
          regionCode: state.region?.code,
          currency: state.region?.currency,
          industryKey: state.industry?.key,
        },
      });
      
      // Check if aborted
      if (abortController.signal.aborted) {
        return;
      }
      
      if (error) throw error;
      
      if (data?.success && data?.artifacts) {
        const artifacts: BusinessData = {
          name: data.artifacts.name || 'New Business',
          tagline: data.artifacts.tagline,
          packages: data.artifacts.packages || [],
          target: data.artifacts.target || '',
          channel: data.artifacts.channel || 'WhatsApp',
          week1Goals: data.artifacts.week1Goals,
          week1: data.artifacts.week1Goals || data.artifacts.week1,
          roles: data.artifacts.roles || [],
          loops: data.artifacts.loops || { sell: '', deliver: '', money: '', support: '' },
          policies: data.artifacts.policies || [],
          kpis: data.artifacts.kpis,
          isDigitize: state.mode === 'digitize',
          migrationPlan: data.artifacts.migrationPlan,
          automations: data.artifacts.automations,
          beforeAfter: data.artifacts.beforeAfter,
        };
        
        dispatch({ type: 'COMPLETE_LAUNCH', requestId, artifacts });
      } else {
        throw new Error(data?.error || 'Failed to generate artifacts');
      }
    } catch (err) {
      console.error('Artifact generation error:', err);
      const errorMsg = state.language === 'ru'
        ? 'Ошибка генерации. Попробуйте снова.'
        : 'Generation failed. Please try again.';
      
      toast.error(errorMsg);
      dispatch({ type: 'FAIL_LAUNCH', requestId, error: errorMsg });
    } finally {
      isLaunchingRef.current = false;
    }
  }, [state.prompt, state.language, state.mode, state.region, state.industry]);
  
  const cancelLaunch = useCallback(() => {
    if (state.requests.launch.activeRequestId) {
      dispatch({ type: 'CANCEL_LAUNCH', requestId: state.requests.launch.activeRequestId });
    }
    isLaunchingRef.current = false;
  }, [state.requests.launch.activeRequestId]);
  
  const startTestDay = useCallback(() => {
    if (!selectors.canRunTestDay(state)) return;
    dispatch({ type: 'START_TESTDAY' });
  }, [state]);
  
  const makeDecision = useCallback((decision: DecisionType) => {
    dispatch({ type: 'MAKE_DECISION', decision });
  }, []);
  
  const scrubReplay = useCallback((progress: number) => {
    if (state.uiState !== 'REPLAY') return;
    dispatch({ type: 'SCRUB_REPLAY', progress });
  }, [state.uiState]);
  
  const requestEdit = useCallback(() => {
    dispatch({ type: 'REQUEST_EDIT' });
  }, []);
  
  const startOver = useCallback(() => {
    cancelLaunch();
    dispatch({ type: 'START_OVER' });
  }, [cancelLaunch]);
  
  // ========================
  // Context Value
  // ========================
  
  const value: DemoContextValue = {
    state,
    dispatch,
    
    // Selectors
    isLaunchEnabled: selectors.isLaunchEnabled(state),
    canRunTestDay: selectors.canRunTestDay(state),
    isRunning: selectors.isRunning(state),
    showSimulator: selectors.showSimulator(state),
    showWizard: selectors.showWizard(state),
    isReplay: selectors.isReplay(state),
    isDayComplete: selectors.isDayComplete(state),
    
    // Actions
    actions: {
      setRegion: (region) => dispatch({ type: 'SET_REGION', region }),
      setIndustry: (industry) => dispatch({ type: 'SET_INDUSTRY', industry }),
      setMode: (mode) => dispatch({ type: 'SET_MODE', mode }),
      setPrompt: (prompt, source) => dispatch({ type: 'SET_PROMPT', prompt, source }),
      clearPrompt: () => dispatch({ type: 'CLEAR_PROMPT' }),
      setEditing: (isEditing) => dispatch({ type: 'SET_EDITING', isEditing }),
      launch,
      cancelLaunch,
      startTestDay,
      makeDecision,
      scrubReplay,
      requestEdit,
      startOver,
    },
  };
  
  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

// ========================
// Hook
// ========================

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
