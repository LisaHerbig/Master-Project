import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function useUnlockedBooks() {
  const { claims } = useAuthContext();
  const [unlockedIds, setUnlockedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!claims?.sub) {
      setLoading(false);
      return;
    }

    supabase
      .from('user_books')
      .select('book_id')
      .then(({ data }) => {
        if (data) setUnlockedIds(new Set(data.map((r) => r.book_id as number)));
        setLoading(false);
      });
  }, [claims?.sub]);

  return { unlockedIds, loading };
}
