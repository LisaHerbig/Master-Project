import { getUnlocked, subscribe } from '@/lib/demo-store';
import { useCallback, useEffect, useState } from 'react';

// Demo mode (web only): unlocks come from the browser.
export function useUnlockedBooks() {
  const [unlockedIds, setUnlockedIds] = useState<Set<number>>(getUnlocked);

  const refresh = useCallback(async () => {
    setUnlockedIds(getUnlocked());
  }, []);

  useEffect(() => subscribe(() => setUnlockedIds(getUnlocked())), []);

  return { unlockedIds, loading: false, refresh };
}
