import type { NewsItem } from '../../types/news.types';

const CRYPTOPANIC_BASE = 'https://cryptopanic.com/api/free/v1';

export async function getCryptoNews(): Promise<NewsItem[]> {
  try {
    const response = await fetch(`${CRYPTOPANIC_BASE}/posts/?auth_token=free&filter=hot&kind=news&currencies=SOL`);
    if (!response.ok) throw new Error('Failed to fetch news');
    const data = await response.json();
    
    return (data.results || []).map((post: {
      id: number;
      title: string;
      source: { title: string };
      url: string;
      published_at: string;
      votes?: { positive: number; negative: number; important: number };
      currencies?: string[];
    }) => ({
      id: String(post.id),
      title: post.title,
      source: post.source?.title || 'Unknown',
      url: post.url,
      publishedAt: new Date(post.published_at).getTime(),
      sentiment: determineSentiment(post.votes),
      currencies: post.currencies || ['SOL'],
    }));
  } catch {
    return [];
  }
}

function determineSentiment(votes?: { positive: number; negative: number; important: number }): NewsItem['sentiment'] {
  if (!votes) return 'NEUTRAL';
  if (votes.positive > votes.negative * 2) return 'BULLISH';
  if (votes.negative > votes.positive * 2) return 'BEARISH';
  if (votes.important > 5) return 'CRITICAL';
  return 'NEUTRAL';
}
