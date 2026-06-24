import { useQuery } from '@tanstack/react-query';
import { getTrendingTokens } from '../lib/api/dexscreener';
import { useGrimoireStore } from '../store/grimoire.store';
import { useEffect } from 'react';

export function useTrendingTokens() {
  const setTrendingTokens = useGrimoireStore((s) => s.setTrendingTokens);
  const lastTokenRefresh = useGrimoireStore((s) => s.lastTokenRefresh);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['trendingTokens'],
    queryFn: getTrendingTokens,
    staleTime: 30000,
    gcTime: 300000,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setTrendingTokens(data);
    }
  }, [data, setTrendingTokens]);

  return { tokens: data || [], isLoading, error, lastRefresh: lastTokenRefresh };
}
