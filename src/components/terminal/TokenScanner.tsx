import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGrimoireStore } from '../../store/grimoire.store';
import { fetchTokenDetail, fetchTrendingTokens } from '../../lib/api';
import { formatPrice, formatPercent, formatCompact, formatAddress } from '../../lib/formatters';
import { Copy, ExternalLink } from 'lucide-react';
import type { Token } from '../../types';

export default function TokenScanner() {
  const [searchQuery, setSearchQuery] = useState('');
  const { scannedToken, setScannedToken, recentSearches, addRecentSearch, setOracleContext, setActiveSection } = useGrimoireStore();

  const { data: trending } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrendingTokens,
  });

  const { data: searchResult, isLoading } = useQuery({
    queryKey: ['tokenDetail', searchQuery],
    queryFn: () => fetchTokenDetail(searchQuery),
    enabled: searchQuery.length > 10,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 10) {
      addRecentSearch(query);
    }
  };

  const handleSelectToken = (token: Token) => {
    setScannedToken(token);
    setSearchQuery(token.address);
    addRecentSearch(token.address);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search Input */}
      <div className="rounded-md border border-border-dim bg-surface overflow-hidden">
        <input
          type="text"
          placeholder="Enter token address or symbol..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-void px-5 py-4 font-mono text-sm text-parchment placeholder:text-text-tertiary focus:outline-none"
        />
      </div>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {recentSearches.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => handleSearch(s)}
              className="rounded-sm border border-border-subtle bg-surface px-3 py-1 font-mono text-xs text-muted hover:border-border-active transition-colors"
            >
              {formatAddress(s)}
            </button>
          ))}
        </div>
      )}

      {/* Trending chips */}
      {!scannedToken && (
        <div className="text-center">
          <h3 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">Currently Trending</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {(trending || []).slice(0, 8).map((token: Token) => (
              <button
                key={token.address}
                onClick={() => handleSelectToken(token)}
                className="rounded-sm border border-border-subtle bg-surface px-3 py-1.5 font-body text-sm text-parchment hover:border-gold-dim transition-colors"
              >
                {token.symbol}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-md skeleton" />
          ))}
        </div>
      )}

      {/* Token Detail */}
      {(searchResult || scannedToken) && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left — data */}
          <div className="rounded-md border border-border-subtle bg-surface p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-elevated flex items-center justify-center font-mono text-sm font-bold text-gold-bright">
                {searchResult?.symbol?.[0] || scannedToken?.symbol?.[0]}
              </div>
              <div>
                <div className="font-body text-base font-medium text-parchment">{searchResult?.name || scannedToken?.name}</div>
                <div className="font-mono text-xs text-muted">{searchResult?.symbol || scannedToken?.symbol}</div>
              </div>
            </div>

            <div className="font-mono text-3xl font-bold text-parchment mb-4">
              ${formatPrice(searchResult?.priceUsd || scannedToken?.priceUsd || 0)}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: '1H', value: searchResult?.priceChange1h || scannedToken?.priceChange1h || 0 },
                { label: '6H', value: searchResult?.priceChange6h || scannedToken?.priceChange6h || 0 },
                { label: '24H', value: searchResult?.priceChange24h || scannedToken?.priceChange24h || 0 },
              ].map((p) => (
                <div key={p.label} className="rounded-sm bg-void px-3 py-2">
                  <div className="text-[10px] text-muted">{p.label}</div>
                  <div className={`font-mono text-sm ${p.value >= 0 ? 'text-positive' : 'text-rose-bright'}`}>{formatPercent(p.value)}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Market Cap', value: `$${formatCompact(searchResult?.marketCap || scannedToken?.marketCap || 0)}` },
                { label: 'Liquidity', value: `$${formatCompact(searchResult?.liquidity || scannedToken?.liquidity || 0)}` },
                { label: 'Volume 24H', value: `$${formatCompact(searchResult?.volume24h || scannedToken?.volume24h || 0)}` },
                { label: 'Buy/Sell', value: `${(searchResult?.txns24h?.buys || 0)} / ${(searchResult?.txns24h?.sells || 0)}` },
              ].map((s) => (
                <div key={s.label} className="rounded-sm bg-void px-3 py-2">
                  <div className="text-[10px] text-muted">{s.label}</div>
                  <div className="font-mono text-sm text-parchment">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(searchResult?.address || scannedToken?.address || '');
                }}
                className="flex items-center gap-1.5 rounded-sm border border-border-dim bg-void px-3 py-1.5 text-xs text-muted hover:border-border-active transition-colors"
              >
                <Copy className="h-3 w-3" /> Copy Address
              </button>
              <a
                href={`https://dexscreener.com/solana/${searchResult?.pairAddress || scannedToken?.pairAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-sm border border-border-dim bg-void px-3 py-1.5 text-xs text-muted hover:border-border-active transition-colors"
              >
                <ExternalLink className="h-3 w-3" /> DexScreener ↗
              </a>
              <button
                onClick={() => {
                  setOracleContext(searchResult || scannedToken);
                  setActiveSection('oracle');
                }}
                className="rounded-sm bg-gold-bright px-3 py-1.5 text-xs font-medium text-void hover:bg-gold-dim transition-colors"
              >
                Ask Oracle
              </button>
            </div>
          </div>

          {/* Right — chart placeholder */}
          <div className="rounded-md border border-border-subtle bg-surface p-6">
            <div className="font-mono text-xs text-muted mb-4">OHLCV Chart</div>
            <div className="h-[300px] flex items-end gap-[2px]">
              {Array.from({ length: 60 }, (_, i) => {
                const h = 20 + Math.sin(i * 0.2) * 25 + Math.random() * 20;
                const isUp = Math.random() > 0.45;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm ${isUp ? 'bg-positive/60' : 'bg-negative/60'}`}
                    style={{ height: `${h}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
