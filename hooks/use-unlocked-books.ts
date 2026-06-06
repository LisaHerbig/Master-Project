import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useState } from 'react';

export function useUnlockedBooks() {
  const { claims } = useAuthContext();
  const [unlockedIds, setUnlockedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchUnlocked = useCallback(async () => {
    if (!claims?.sub) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('user_books').select('book_id');
    if (data) setUnlockedIds(new Set(data.map((r) => r.book_id as number)));
    setLoading(false);
  }, [claims?.sub]);

  useEffect(() => {
    fetchUnlocked();
  }, [fetchUnlocked]);

  return { unlockedIds, loading, refresh: fetchUnlocked };
}
