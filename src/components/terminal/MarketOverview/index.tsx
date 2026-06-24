import { useRef, useEffect } from 'react';
import { useTrendingTokens } from '../../../hooks/useTrendingTokens';
import { useMarketData } from '../../../hooks/useMarketData';
import { useGrimoireStore } from '../../../store/grimoire.store';
import { formatPrice, formatLargeNumber, formatTimeAgo } from '../../../lib/formatters';
import { PriceChange } from '../../ui/PriceChange';
import { CountUp } from '../../ui/CountUp';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { useNavigate } from 'react-router-dom';

export function Overview() {
  const { tokens, isLoading } = useTrendingTokens();
  const { globalData } = useMarketData();
  const signals = useGrimoireStore((s) => s.signals);
  const setScannedToken = useGrimoireStore((s) => s.setScannedToken);
  const navigate = useNavigate();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const global = globalData?.data;

  useEffect(() => {
    if (!chartContainerRef.current) return;

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
      height: 360,
      crosshair: {
        vertLine: { color: '#D4A843', width: 1, style: 2 },
        horzLine: { color: '#D4A843', width: 1, style: 2 },
      },
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
    const basePrice = 140;
    for (let i = 0; i < 168; i++) {
      const time = (Math.floor(Date.now() / 1000) - (168 - i) * 3600) as import('lightweight-charts').Time;
      const open = basePrice + Math.sin(i * 0.08) * 10 + (Math.random() - 0.5) * 5;
      const close = open + (Math.random() - 0.5) * 8;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
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
  }, []);

  const handleTokenClick = (token: typeof tokens[0]) => {
    setScannedToken(token);
    navigate('/terminal/scanner');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
          <span className="font-mono text-xs text-muted uppercase tracking-wider">Total MCap</span>
          <div className="mt-1">
            {global ? (
              <CountUp
                value={global.total_market_cap.usd}
                formatter={(v) => formatLargeNumber(v)}
                className="font-mono text-xl text-parchment"
              />
            ) : (
              <span className="font-mono text-xl text-parchment">—</span>
            )}
          </div>
        </div>
        <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
          <span className="font-mono text-xs text-muted uppercase tracking-wider">24h Volume</span>
          <div className="mt-1">
            {global ? (
              <CountUp
                value={global.total_volume.usd}
                formatter={(v) => formatLargeNumber(v)}
                className="font-mono text-xl text-parchment"
              />
            ) : (
              <span className="font-mono text-xl text-parchment">—</span>
            )}
          </div>
        </div>
        <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
          <span className="font-mono text-xs text-muted uppercase tracking-wider">SOL Dominance</span>
          <div className="mt-1">
            {global ? (
              <CountUp
                value={global.market_cap_percentage.sol}
                suffix="%"
                className="font-mono text-xl text-parchment"
              />
            ) : (
              <span className="font-mono text-xl text-parchment">—</span>
            )}
          </div>
        </div>
        <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
          <span className="font-mono text-xs text-muted uppercase tracking-wider">Active Signals</span>
          <div className="mt-1">
            <CountUp
              value={signals.length}
              className="font-mono text-xl text-parchment"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Trending Tokens Table */}
        <div className="bg-surface border border-[var(--border-subtle)] overflow-hidden" style={{ borderRadius: '4px' }}>
          <div className="px-5 py-3 border-b border-[var(--border-subtle)]">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">Top Trending Tokens</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="px-5 py-2 text-left font-mono text-xs text-muted uppercase tracking-wider font-normal">#</th>
                  <th className="px-5 py-2 text-left font-mono text-xs text-muted uppercase tracking-wider font-normal">Token</th>
                  <th className="px-5 py-2 text-right font-mono text-xs text-muted uppercase tracking-wider font-normal">Price</th>
                  <th className="px-5 py-2 text-right font-mono text-xs text-muted uppercase tracking-wider font-normal">1H%</th>
                  <th className="px-5 py-2 text-right font-mono text-xs text-muted uppercase tracking-wider font-normal">6H%</th>
                  <th className="px-5 py-2 text-right font-mono text-xs text-muted uppercase tracking-wider font-normal">24H%</th>
                  <th className="px-5 py-2 text-right font-mono text-xs text-muted uppercase tracking-wider font-normal">Volume</th>
                  <th className="px-5 py-2 text-right font-mono text-xs text-muted uppercase tracking-wider font-normal">Liquidity</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-[var(--border-subtle)]">
                      <td colSpan={8} className="px-5 py-3">
                        <div className="h-4 bg-elevated rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : (
                  tokens.slice(0, 10).map((token, i) => (
                    <tr
                      key={token.pairAddress}
                      onClick={() => handleTokenClick(token)}
                      className="border-b border-[var(--border-subtle)] hover:bg-elevated transition-colors duration-150 cursor-pointer border-l-2 border-l-transparent hover:border-l-gold-bright"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-muted">{i + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-parchment font-medium">${token.baseToken.symbol}</span>
                          <span className="font-body text-xs text-muted truncate max-w-[100px]">{token.baseToken.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-sm text-parchment tabular-nums">{formatPrice(parseFloat(token.priceUsd))}</td>
                      <td className="px-5 py-3 text-right"><PriceChange value={token.priceChange.h1} /></td>
                      <td className="px-5 py-3 text-right"><PriceChange value={token.priceChange.h6} /></td>
                      <td className="px-5 py-3 text-right"><PriceChange value={token.priceChange.h24} /></td>
                      <td className="px-5 py-3 text-right font-mono text-xs text-muted tabular-nums">${(token.volume.h24 / 1000).toFixed(0)}k</td>
                      <td className="px-5 py-3 text-right font-mono text-xs text-muted tabular-nums">${(token.liquidity.usd / 1000).toFixed(0)}k</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Signals */}
        <div className="bg-surface border border-[var(--border-subtle)] overflow-hidden" style={{ borderRadius: '4px' }}>
          <div className="px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">Recent Signals</span>
            <a href="/terminal/signals" className="font-mono text-xs text-gold-dim hover:text-gold-bright transition-colors no-underline">
              View all →
            </a>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {signals.slice(0, 5).map((signal) => (
              <div
                key={signal.id}
                className="px-5 py-3 hover:bg-elevated transition-colors duration-150 border-l-2 border-l-transparent hover:border-l-gold-bright cursor-pointer"
                onClick={() => handleTokenClick(signal.token)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 ${
                      signal.grade === 'S'
                        ? 'text-gold-bright bg-gold-ghost'
                        : signal.grade === 'A'
                        ? 'text-positive bg-positive/10'
                        : 'text-muted bg-elevated'
                    }`}
                    style={{ borderRadius: '2px' }}
                  >
                    {signal.grade}
                  </span>
                  <span className="font-mono text-sm text-parchment">${signal.token.baseToken.symbol}</span>
                  <span className="font-mono text-xs text-muted ml-auto">{formatTimeAgo(signal.timestamp)}</span>
                </div>
                <p className="font-body text-xs text-muted">{signal.patternName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOL Chart */}
      <div className="bg-surface border border-[var(--border-subtle)] overflow-hidden" style={{ borderRadius: '4px' }}>
        <div className="px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <span className="font-mono text-xs text-muted uppercase tracking-wider">SOL / USD</span>
          <div className="flex items-center gap-2">
            {['15M', '1H', '4H', '1D', '1W'].map((tf) => (
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
    </div>
  );
}
