// src/hooks/useSymbolicRouter.ts
import { useState, useEffect } from 'react';

const traumaKeywords = ['trauma', 'panic', 'flashback', 'overwhelmed', 'triggered', 'dissociation'];

export function useSymbolicRouter(message?: string) {
  const [currentAgent, setCurrentAgent] = useState('guide');

  useEffect(() => {
    if (message) {
      const lower = message.toLowerCase();
      if (traumaKeywords.some((kw) => lower.includes(kw))) {
        setCurrentAgent('ptsd');
        return;
      }
      if (lower.includes('dream')) {
        setCurrentAgent('dream');
      } else if (lower.includes('mirror')) {
        setCurrentAgent('soulmirror');
      } else if (lower.includes('shadow')) {
        setCurrentAgent('shadow');
      } else {
        setCurrentAgent('guide');
      }
    }
  }, [message]);

  return { currentAgent };
}
