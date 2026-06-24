import { useState } from 'react';
import { useNewsData } from '../../../hooks/useNewsData';
import { formatTimeAgo } from '../../../lib/formatters';
import { ExternalLink } from 'lucide-react';

const sentimentColors = {
  BULLISH: 'text-positive bg-positive/10',
  BEARISH: 'text-rose-bright bg-rose-ghost',
  NEUTRAL: 'text-muted bg-elevated',
  CRITICAL: 'text-rose-bright bg-rose-ghost border border-rose-bright',
};

export function NewsIntel() {
  const { news, isLoading } = useNewsData();
  const [filter, setFilter] = useState({
    sentiment: 'all',
    timeRange: '24h',
  });

  const filteredNews = news
    .filter((item) => {
      if (filter.sentiment !== 'all' && item.sentiment !== filter.sentiment.toUpperCase()) return false;
      return true;
    })
    .filter((item) => {
      const hoursAgo = (Date.now() - item.publishedAt) / (1000 * 60 * 60);
      if (filter.timeRange === '1h') return hoursAgo <= 1;
      if (filter.timeRange === '6h') return hoursAgo <= 6;
      return true;
    });

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6">
        {/* News Feed */}
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-surface border border-[var(--border-subtle)] p-5 animate-pulse" style={{ borderRadius: '4px' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-16 h-5 bg-elevated rounded" />
                  <div className="w-20 h-5 bg-elevated rounded" />
                </div>
                <div className="w-full h-4 bg-elevated rounded mb-2" />
                <div className="w-3/4 h-4 bg-elevated rounded" />
              </div>
            ))
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-mono text-sm text-muted">No news articles found</p>
            </div>
          ) : (
            filteredNews.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-surface border border-[var(--border-subtle)] p-5 hover:bg-elevated transition-colors duration-150 no-underline group"
                style={{ borderRadius: '4px' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${sentimentColors[item.sentiment]}`}
                    style={{ borderRadius: '2px' }}
                  >
                    {item.sentiment}
                  </span>
                  <span className="font-body text-xs text-muted">{item.source}</span>
                  <div className="flex-1" />
                  <span className="font-mono text-xs text-muted">{formatTimeAgo(item.publishedAt)}</span>
                  <ExternalLink className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-body text-base text-parchment mb-2 leading-snug">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2">
                  {item.currencies.slice(0, 3).map((currency) => (
                    <span
                      key={currency}
                      className="font-mono text-[10px] text-gold-dim px-1.5 py-0.5 bg-gold-ghost"
                      style={{ borderRadius: '2px' }}
                    >
                      ${currency}
                    </span>
                  ))}
                </div>
              </a>
            ))
          )}
        </div>

        {/* Sidebar Filter */}
        <div className="space-y-4">
          <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">Sentiment</span>
            <div className="space-y-1">
              {['all', 'bullish', 'bearish', 'neutral'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter({ ...filter, sentiment: s })}
                  className={`w-full text-left px-3 py-2 font-mono text-xs capitalize transition-colors cursor-pointer bg-transparent border-none ${
                    filter.sentiment === s
                      ? 'text-gold-bright bg-gold-ghost'
                      : 'text-muted hover:bg-elevated'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">Time Range</span>
            <div className="space-y-1">
              {['1h', '6h', '24h'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter({ ...filter, timeRange: t })}
                  className={`w-full text-left px-3 py-2 font-mono text-xs transition-colors cursor-pointer bg-transparent border-none ${
                    filter.timeRange === t
                      ? 'text-gold-bright bg-gold-ghost'
                      : 'text-muted hover:bg-elevated'
                  }`}
                >
                  Last {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
