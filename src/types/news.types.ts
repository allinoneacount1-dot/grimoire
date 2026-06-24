export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: number;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'CRITICAL';
  currencies: string[];
  summary?: string;
}

export interface NewsFilter {
  source: string;
  sentiment: string;
  currency: string;
  timeRange: '1h' | '6h' | '24h' | 'all';
}
