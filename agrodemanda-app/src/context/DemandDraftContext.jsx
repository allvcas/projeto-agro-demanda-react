import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storageGet, storageSet, storageRemove } from '../utils/storage';

const DemandDraftContext = createContext(null);
const DRAFT_KEY = 'agrodemanda_draft';

const initialDraft = {
  category: null,
  description: '',
  location: null,
};

function draftReducer(state, action) {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'RESET':
      return initialDraft;
    default:
      return state;
  }
}

export function DemandDraftProvider({ children }) {
  const [draft, dispatch] = useReducer(draftReducer, null, () => {
    const saved = storageGet(DRAFT_KEY);
    return saved ? { ...initialDraft, ...saved } : initialDraft;
  });

  useEffect(() => {
    if (draft.category || draft.description || draft.location) {
      storageSet(DRAFT_KEY, draft);
    } else {
      storageRemove(DRAFT_KEY);
    }
  }, [draft]);

  const setCategory = (category) => dispatch({ type: 'SET_CATEGORY', payload: category });
  const setDescription = (description) => dispatch({ type: 'SET_DESCRIPTION', payload: description });
  const setLocation = (location) => dispatch({ type: 'SET_LOCATION', payload: location });
  const resetDraft = () => {
    dispatch({ type: 'RESET' });
    storageRemove(DRAFT_KEY);
  };

  return (
    <DemandDraftContext.Provider
      value={{
        draft,
        setCategory,
        setDescription,
        setLocation,
        resetDraft,
      }}
    >
      {children}
    </DemandDraftContext.Provider>
  );
}

export function useDemandDraft() {
  const context = useContext(DemandDraftContext);
  if (!context) {
    throw new Error('useDemandDraft must be used within a DemandDraftProvider');
  }
  return context;
}
