import { useState, useEffect, useRef } from 'react';
import { useGrimoireStore } from '../../../store/grimoire.store';
import { useTokenData } from '../../../hooks/useTokenData';
import { formatPrice, formatLargeNumber, formatAddress } from '../../../lib/formatters';
import { PriceChange } from '../../ui/PriceChange';
import { Copy, ExternalLink, MessageSquare } from 'lucide-react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { useNavigate } from 'react-router-dom';

export function TokenScanner() {
  const [query, setQuery] = useState('');
  const scannedToken = useGrimoireStore((s) => s.scannedToken);
  const setScannedToken = useGrimoireStore((s) => s.setScannedToken);
  const recentSearches = useGrimoireStore((s) => s.recentSearches);
  const trendingTokens = useGrimoireStore((s) => s.trendingTokens);
  const { searchResults, selectToken } = useTokenData(query);
  const navigate = useNavigate();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const activeToken = scannedToken;

  useEffect(() => {
    if (!chartContainerRef.current || !activeToken) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#07050A' },
        textColor: '#8A7F76',
      },
      grid: {
        vertLines: { color: 'rgba(212,168,67,0.04)' },
        horzLines: { color: 'rgba(212,168,67,0.04)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 480,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4E8C6A',
      downColor: '#8C3E4A',
      borderUpColor: '#4E8C6A',
      borderDownColor: '#8C3E4A',
      wickUpColor: '#4E8C6A',
      wickDownColor: '#8C3E4A',
    });

    const data = [];
    const basePrice = parseFloat(activeToken.priceUsd) || 0.001;
    for (let i = 0; i < 100; i++) {
      const time = (Math.floor(Date.now() / 1000) - (100 - i) * 900) as import('lightweight-charts').Time;
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.1);
      const close = open * (1 + (Math.random() - 0.5) * 0.08);
      const high = Math.max(open, close) * (1 + Math.random() * 0.03);
      const low = Math.min(open, close) * (1 - Math.random() * 0.03);
      data.push({ time, open, high, low, close });
    }

    candlestickSeries.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [activeToken]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length > 20) {
      selectToken(q);
    }
  };

  const handleTrendingClick = (token: typeof trendingTokens[0]) => {
    setScannedToken(token);
    setQuery(token.baseToken.address);
  };

  const handleCopyAddress = () => {
    if (activeToken) {
      navigator.clipboard.writeText(activeToken.baseToken.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAskOracle = () => {
    navigate('/terminal/oracle');
  };

  if (!activeToken) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Enter token address or symbol..."
            className="w-full h-16 px-6 bg-surface border border-[var(--border-dim)] text-parchment font-mono text-lg placeholder:text-muted focus:border-gold-dim focus:outline-none transition-colors mb-6"
            style={{ borderRadius: '2px' }}
          />
          <p className="font-body text-sm text-muted mb-4">
            Try: $BONK, $WIF, $POPCAT or paste a contract address
          </p>

          {recentSearches.length > 0 && (
            <div className="mb-6">
              <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">Recent</span>
              <div className="flex flex-wrap gap-2">
                {recentSearches.slice(0, 5).map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="px-3 py-1.5 bg-elevated border border-[var(--border-subtle)] text-parchment font-mono text-xs hover:border-gold-dim transition-colors cursor-pointer"
                    style={{ borderRadius: '2px' }}
                  >
                    {search.length > 20 ? formatAddress(search) : search}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">Trending</span>
            <div className="flex flex-wrap gap-2">
              {trendingTokens.slice(0, 5).map((token) => (
                <button
                  key={token.pairAddress}
                  onClick={() => handleTrendingClick(token)}
                  className="px-3 py-1.5 bg-gold-ghost border border-gold-dim/30 text-gold-bright font-mono text-xs hover:border-gold-dim transition-colors cursor-pointer"
                  style={{ borderRadius: '2px' }}
                >
                  ${token.baseToken.symbol}
                </button>
              ))}
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-6 space-y-2">
              <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">Results</span>
              {searchResults.slice(0, 5).map((token) => (
                <div
                  key={token.pairAddress}
                  onClick={() => handleTrendingClick(token)}
                  className="p-4 bg-surface border border-[var(--border-subtle)] hover:bg-elevated transition-colors cursor-pointer"
                  style={{ borderRadius: '4px' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-parchment font-medium">${token.baseToken.symbol}</span>
                      <span className="font-body text-xs text-muted">{token.baseToken.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-parchment tabular-nums">{formatPrice(parseFloat(token.priceUsd))}</span>
                      <PriceChange value={token.priceChange.h1} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Chart */}
        <div className="bg-surface border border-[var(--border-subtle)] overflow-hidden" style={{ borderRadius: '4px' }}>
          <div className="px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-parchment font-medium">${activeToken.baseToken.symbol}</span>
              <span className="font-body text-xs text-muted">{activeToken.baseToken.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {['5M', '15M', '1H', '4H', '1D'].map((tf) => (
                <button
                  key={tf}
                  className={`px-2 py-1 font-mono text-xs transition-colors cursor-pointer bg-transparent border-none ${
                    tf === '4H' ? 'text-gold-bright' : 'text-muted hover:text-parchment'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div ref={chartContainerRef} />
        </div>

        {/* Data Panel */}
        <div className="space-y-4">
          {/* Token Header */}
          <div className="bg-surface border border-[var(--border-subtle)] p-5" style={{ borderRadius: '4px' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-elevated flex items-center justify-center">
                <span className="font-mono text-sm text-gold-bright">{activeToken.baseToken.symbol[0]}</span>
              </div>
              <div>
                <h3 className="font-mono text-sm text-parchment font-medium">{activeToken.baseToken.symbol}</h3>
                <p className="font-body text-xs text-muted">{activeToken.baseToken.name}</p>
              </div>
            </div>
            <p className="font-mono text-2xl text-parchment tabular-nums mb-2">
              {formatPrice(parseFloat(activeToken.priceUsd))}
            </p>
            <div className="flex gap-2">
              <PriceChange value={activeToken.priceChange.h1} size="md" />
              <PriceChange value={activeToken.priceChange.h6} size="md" />
              <PriceChange value={activeToken.priceChange.h24} size="md" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="bg-surface border border-[var(--border-subtle)] p-5 grid grid-cols-2 gap-4" style={{ borderRadius: '4px' }}>
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider">Market Cap</span>
              <p className="font-mono text-sm text-parchment tabular-nums">{formatLargeNumber(activeToken.marketCap || activeToken.fdv)}</p>
            </div>
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider">FDV</span>
              <p className="font-mono text-sm text-parchment tabular-nums">{formatLargeNumber(activeToken.fdv)}</p>
            </div>
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider">24h Volume</span>
              <p className="font-mono text-sm text-parchment tabular-nums">{formatLargeNumber(activeToken.volume.h24)}</p>
            </div>
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider">Liquidity</span>
              <p className="font-mono text-sm text-parchment tabular-nums">{formatLargeNumber(activeToken.liquidity.usd)}</p>
            </div>
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider">Buys (24h)</span>
              <p className="font-mono text-sm text-positive tabular-nums">{activeToken.txns.h24.buys}</p>
            </div>
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider">Sells (24h)</span>
              <p className="font-mono text-sm text-rose-bright tabular-nums">{activeToken.txns.h24.sells}</p>
            </div>
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider">B/S Ratio</span>
              <p className="font-mono text-sm text-parchment tabular-nums">
                {activeToken.txns.h24.sells > 0
                  ? (activeToken.txns.h24.buys / activeToken.txns.h24.sells).toFixed(2)
                  : '∞'}
              </p>
            </div>
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider">Pair Age</span>
              <p className="font-mono text-sm text-parchment tabular-nums">
                {activeToken.pairCreatedAt
                  ? `${Math.floor((Date.now() - activeToken.pairCreatedAt) / 3600000)}h`
                  : '—'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-surface border border-[var(--border-subtle)] p-5 space-y-3" style={{ borderRadius: '4px' }}>
            <button
              onClick={handleCopyAddress}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-elevated border border-[var(--border-dim)] text-parchment font-mono text-xs hover:border-gold-dim transition-colors cursor-pointer"
              style={{ borderRadius: '2px' }}
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <a
              href={`https://dexscreener.com/solana/${activeToken.pairAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-elevated border border-[var(--border-dim)] text-parchment font-mono text-xs hover:border-gold-dim transition-colors no-underline"
              style={{ borderRadius: '2px' }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View on DexScreener ↗
            </a>
            <button
              onClick={handleAskOracle}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gold-ghost border border-gold-dim/30 text-gold-bright font-mono text-xs hover:border-gold-dim transition-colors cursor-pointer"
              style={{ borderRadius: '2px' }}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask Oracle about this token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
