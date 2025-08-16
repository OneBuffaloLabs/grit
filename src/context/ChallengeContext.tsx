'use client';

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { ChallengeDoc } from '@/types';

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
