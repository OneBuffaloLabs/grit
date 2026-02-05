'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  Dispatch,
} from 'react';
import { ChallengeDoc, ChallengeType, ChallengeRules } from '@/types';
import { getActiveChallenge, createChallenge } from '@/lib/db';

type State = {
  challenge: ChallengeDoc | null;
  isLoading: boolean;
};

type Action =
  | { type: 'SET_CHALLENGE'; payload: ChallengeDoc | null }
  | { type: 'START_LOADING' }
  | { type: 'STOP_LOADING' };

const initialState: State = {
  challenge: null,
  isLoading: true,
};

const ChallengeStateContext = createContext<State | undefined>(undefined);
const ChallengeDispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

const challengeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CHALLENGE':
      return { ...state, challenge: action.payload, isLoading: false };
    case 'START_LOADING':
      return { ...state, isLoading: true };
    case 'STOP_LOADING':
      return { ...state, isLoading: false };
    default:
      throw new Error(`Unknown action type`);
  }
};

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(challengeReducer, initialState);

  // Load active challenge on mount
  useEffect(() => {
    const loadChallenge = async () => {
      dispatch({ type: 'START_LOADING' });
      try {
        const activeDoc = await getActiveChallenge();
        dispatch({ type: 'SET_CHALLENGE', payload: activeDoc });
      } catch (error) {
        console.error('Failed to load challenge:', error);
        dispatch({ type: 'STOP_LOADING' }); // Stop loading even on error
      }
    };

    loadChallenge();
  }, []);

  return (
    <ChallengeStateContext.Provider value={state}>
      <ChallengeDispatchContext.Provider value={dispatch}>
        {children}
      </ChallengeDispatchContext.Provider>
    </ChallengeStateContext.Provider>
  );
};

export const useChallengeState = () => {
  const context = useContext(ChallengeStateContext);
  if (context === undefined) {
    throw new Error('useChallengeState must be used within a ChallengeProvider');
  }
  return context;
};

export const useChallengeDispatch = () => {
  const context = useContext(ChallengeDispatchContext);
  if (context === undefined) {
    throw new Error('useChallengeDispatch must be used within a ChallengeProvider');
  }
  return context;
};

// --- Controller Hook ---
export const useChallengeController = () => {
  const dispatch = useChallengeDispatch();

  const startChallenge = async (
    name: string,
    type: ChallengeType,
    rules: ChallengeRules,
    duration: number
  ) => {
    try {
      const newChallenge = await createChallenge(name, type, rules, duration);
      if (newChallenge) {
        dispatch({ type: 'SET_CHALLENGE', payload: newChallenge });
      }
    } catch (err) {
      console.error('Error starting challenge:', err);
    }
  };

  const resetChallenge = async () => {
    // Implementation for reset if needed
    dispatch({ type: 'SET_CHALLENGE', payload: null });
  };

  return {
    startChallenge,
    resetChallenge,
  };
};
