import { useQuery } from '@tanstack/react-query';
import { getTokenByAddress, searchTokens } from '../lib/api/dexscreener';
import { useGrimoireStore } from '../store/grimoire.store';

export function useTokenData(query: string) {
  const addRecentSearch = useGrimoireStore((s) => s.addRecentSearch);
  const setScannedToken = useGrimoireStore((s) => s.setScannedToken);

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['tokenSearch', query],
    queryFn: () => searchTokens(query),
    enabled: query.length > 0,
    staleTime: 30000,
  });

  const { data: tokenDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['tokenDetail', query],
    queryFn: () => getTokenByAddress(query),
    enabled: query.length > 20,
    staleTime: 30000,
  });

  const selectToken = (address: string) => {
    addRecentSearch(address);
  };

  return {
    searchResults: searchResults || [],
    tokenDetail,
    isLoading: searchLoading || detailLoading,
    selectToken,
    setScannedToken,
  };
}
