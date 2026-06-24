import { useQuery } from '@tanstack/react-query';
import { getCryptoNews } from '../lib/api/news';
import { useGrimoireStore } from '../store/grimoire.store';
import { useEffect } from 'react';

export function useNewsData() {
  const setNews = useGrimoireStore((s) => s.setNews);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoNews'],
    queryFn: getCryptoNews,
    staleTime: 60000,
    gcTime: 300000,
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setNews(data);
    }
  }, [data, setNews]);

  return { news: data || [], isLoading, error };
}
