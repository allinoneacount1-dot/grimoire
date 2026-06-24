import { useTrendingTokens } from '../../hooks/useTrendingTokens';
import { useNewsData } from '../../hooks/useNewsData';
import { formatPrice, formatPercent, formatTimeAgo } from '../../lib/formatters';
import { ExternalLink } from 'lucide-react';

export function LivePreview() {
  const { tokens, isLoading: tokensLoading } = useTrendingTokens();
  const { news, isLoading: newsLoading } = useNewsData();

  return (
    <section className="relative py-[clamp(80px,12vh,160px)]">
      <div className="shell">
        <div className="mb-12">
          <span className="font-mono text-xs text-gold-dim tracking-[0.25em] uppercase">
            Live From Solana
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Tokens */}
          <div
            className="bg-surface border border-[var(--border-subtle)] overflow-hidden"
            style={{ borderRadius: '4px' }}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-xs text-muted uppercase tracking-wider">
                Trending Tokens
              </span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-bright animate-pulse-gold" />
                <span className="font-mono text-xs text-rose-bright">LIVE</span>
              </div>
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
              {tokensLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-5 py-3 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-3 bg-elevated rounded" />
                      <div className="w-16 h-3 bg-elevated rounded" />
                      <div className="flex-1" />
                      <div className="w-12 h-3 bg-elevated rounded" />
                    </div>
                  </div>
                ))
              ) : (
                tokens.slice(0, 5).map((token, i) => (
                  <div
                    key={token.pairAddress}
                    className="px-5 py-3 hover:bg-elevated transition-colors duration-150 border-l-2 border-transparent hover:border-gold-bright cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted w-4">
                        {i + 1}
                      </span>
                      <span className="font-mono text-sm text-parchment font-medium">
                        ${token.baseToken.symbol}
                      </span>
                      <div className="flex-1" />
                      <span className="font-mono text-sm text-parchment tabular-nums">
                        {formatPrice(parseFloat(token.priceUsd))}
                      </span>
                      <span
                        className={`font-mono text-xs tabular-nums px-1.5 py-0.5 ${
                          token.priceChange.h1 >= 0
                            ? 'text-positive bg-positive/10'
                            : 'text-rose-bright bg-rose-ghost'
                        }`}
                        style={{ borderRadius: '2px' }}
                      >
                        {formatPercent(token.priceChange.h1)}
                      </span>
                      <span className="font-mono text-xs text-muted tabular-nums">
                        ${(token.volume.h24 / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* News Feed */}
          <div
            className="bg-surface border border-[var(--border-subtle)] overflow-hidden"
            style={{ borderRadius: '4px' }}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)]">
              <span className="font-mono text-xs text-muted uppercase tracking-wider">
                News Intel
              </span>
              <span className="font-mono text-xs text-muted">
                {news.length} articles
              </span>
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
              {newsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-12 h-4 bg-elevated rounded" />
                      <div className="w-8 h-4 bg-elevated rounded" />
                    </div>
                    <div className="w-full h-3 bg-elevated rounded" />
                  </div>
                ))
              ) : (
                news.slice(0, 4).map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-5 py-4 hover:bg-elevated transition-colors duration-150 no-underline group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                          item.sentiment === 'BULLISH'
                            ? 'text-positive bg-positive/10'
                            : item.sentiment === 'BEARISH'
                            ? 'text-rose-bright bg-rose-ghost'
                            : 'text-muted bg-elevated'
                        }`}
                        style={{ borderRadius: '2px' }}
                      >
                        {item.sentiment}
                      </span>
                      <span className="font-body text-xs text-muted">
                        {item.source}
                      </span>
                      <div className="flex-1" />
                      <span className="font-mono text-xs text-muted">
                        {formatTimeAgo(item.publishedAt)}
                      </span>
                      <ExternalLink className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-body text-sm text-parchment line-clamp-2">
                      {item.title}
                    </p>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
