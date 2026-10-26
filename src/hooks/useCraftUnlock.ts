import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ruu-craft-goblin';
const PATTERN = ['yarn', 'scissors', 'palette'] as const;
export type PatternPiece = (typeof PATTERN)[number];

export function useCraftUnlock() {
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setUnlocked(localStorage.getItem(STORAGE_KEY) === '1');
  }, []);

  const tapIcon = useCallback((piece: PatternPiece) => {
    const expected = PATTERN[progress];
    if (piece === expected) {
      const next = progress + 1;
      if (next >= PATTERN.length) {
        localStorage.setItem(STORAGE_KEY, '1');
        setUnlocked(true);
        setProgress(0);
        return true;
      }
      setProgress(next);
      return false;
    }
    setProgress(piece === PATTERN[0] ? 1 : 0);
    return false;
  }, [progress]);

  return { unlocked, progress, tapIcon, patternLength: PATTERN.length };
}
