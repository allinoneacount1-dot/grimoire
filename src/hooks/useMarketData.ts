import { useQuery } from '@tanstack/react-query';
import { getGlobalMarketData, getMarketData } from '../lib/api/coingecko';

export function useMarketData() {
  const { data: globalData, isLoading: globalLoading } = useQuery({
    queryKey: ['globalMarket'],
    queryFn: getGlobalMarketData,
    staleTime: 60000,
    gcTime: 300000,
    refetchInterval: 60000,
  });

  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ['marketData'],
    queryFn: () => getMarketData(),
    staleTime: 60000,
    gcTime: 300000,
    refetchInterval: 60000,
  });

  return {
    globalData,
    marketData,
    isLoading: globalLoading || marketLoading,
  };
}
