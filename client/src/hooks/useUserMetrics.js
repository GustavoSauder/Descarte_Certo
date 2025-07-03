import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchUserMetrics, createUserMetrics } from '../services/metricsService';

export function useUserMetrics(user) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (!user) return;
    let subscription;
    let isMounted = true;

    async function load() {
      try {
        let data = await fetchUserMetrics(user.id);
        if (!data) {
          data = await createUserMetrics(user.id);
        }
        if (isMounted) setMetrics(data);

        // Real-time subscription
        subscription = supabase
          .channel('public:user_metrics')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'user_metrics',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              if (payload.new && isMounted) setMetrics(payload.new);
            }
          )
          .subscribe();
      } catch (err) {
        console.error(err);
      }
    }

    load();

    return () => {
      isMounted = false;
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [user]);

  return metrics;
} 