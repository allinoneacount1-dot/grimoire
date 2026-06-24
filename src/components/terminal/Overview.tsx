import { useQuery } from '@tanstack/react-query';
import { useGrimoireStore } from '../../store/grimoire.store';
import { fetchTrendingTokens, fetchPrices, fetchNews } from '../../lib/api';
import { generateSignals } from '../../lib/signal-engine';
import { formatPrice, formatPercent, formatCompact, timeAgo } from '../../lib/formatters';
import { useEffect } from 'react';
import type { Token } from '../../types';

function StatCard({ label, value, change, prefix = '', suffix = '' }: {
  label: string;
  value: number;
  change?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface p-4">
      <div className="text-[11px] text-muted uppercase tracking-wider mb-2">{label}</div>
      <div className="font-mono text-xl font-bold text-parchment">
        {prefix}{formatCompact(value)}{suffix}
      </div>
      {change && (
        <div className={`font-mono text-xs mt-1 ${change.startsWith('+') || !change.startsWith('-') ? 'text-positive' : 'text-rose-bright'}`}>
          {change}
        </div>
      )}
    </div>
  );
}

export default function Overview() {
  const { setTrendingTokens, setSignals, setLastSignalScan, setNews } = useGrimoireStore();

  const { data: prices } = useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    refetchInterval: 30000,
  });

  const { data: tokens } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrendingTokens,
    refetchInterval: 30000,
  });

  const { data: newsData } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      setTrendingTokens(tokens);
      const signals = generateSignals(tokens);
      setSignals(signals);
      setLastSignalScan(Date.now());
    }
  }, [tokens, setTrendingTokens, setSignals, setLastSignalScan]);

  useEffect(() => {
    if (newsData) setNews(newsData);
  }, [newsData, setNews]);

  const { signals } = useGrimoireStore();
  const solMarketCap = (prices?.solana?.usd || 0) * 440000000;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="SOL Market Cap" value={solMarketCap} prefix="$" change={formatPercent(prices?.solana?.change24h || 0)} />
        <StatCard label="24h Volume" value={(prices?.solana?.usd || 0) * 28000000} prefix="$" />
        <StatCard label="SOL Price" value={prices?.solana?.usd || 0} prefix="$" change={formatPercent(prices?.solana?.change24h || 0)} />
        <StatCard label="Active Signals" value={signals.length} change={`${signals.filter((s) => s.grade === 'S').length} S-grade`} />
      </div>

      {/* Trending Tokens Table */}
      <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Top Trending Tokens</span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-bright animate-pulse-gold" />
            <span className="font-mono text-[10px] text-rose-bright">LIVE</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                {['#', 'TOKEN', 'PRICE', '1H', '6H', '24H', 'VOLUME', 'LIQUIDITY'].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider text-muted font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {(tokens || []).slice(0, 10).map((token: Token, i: number) => (
                <tr key={token.address} className="group hover:bg-elevated transition-colors cursor-pointer">
                  <td className="px-5 py-3 font-mono text-xs text-text-tertiary">{i + 1}</td>
                  <td className="px-5 py-3">
                    <span className="font-body text-sm font-medium text-parchment">{token.symbol}</span>
                    <span className="ml-2 text-xs text-muted">{token.name}</span>
                  </td>
                  <td className="px-5 py-3 font-mono text-sm text-parchment">${formatPrice(token.priceUsd)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-sm px-2 py-0.5 font-mono text-[11px] ${token.priceChange1h >= 0 ? 'bg-positive/10 text-positive' : 'bg-rose-ghost text-rose-bright'}`}>
                      {formatPercent(token.priceChange1h)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-sm px-2 py-0.5 font-mono text-[11px] ${token.priceChange6h >= 0 ? 'bg-positive/10 text-positive' : 'bg-rose-ghost text-rose-bright'}`}>
                      {formatPercent(token.priceChange6h)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-sm px-2 py-0.5 font-mono text-[11px] ${token.priceChange24h >= 0 ? 'bg-positive/10 text-positive' : 'bg-rose-ghost text-rose-bright'}`}>
                      {formatPercent(token.priceChange24h)}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted">${formatCompact(token.volume24h)}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted">${formatCompact(token.liquidity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Signals */}
      <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
        <div className="border-b border-border-subtle px-5 py-3">
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Recent Signals</span>
        </div>
        <div className="divide-y divide-border-subtle">
          {signals.slice(0, 5).map((signal) => (
            <div key={signal.id} className="flex items-center justify-between px-5 py-3 hover:bg-elevated transition-colors">
              <div className="flex items-center gap-3">
                <span className={`inline-block w-1.5 h-6 rounded-full ${
                  signal.grade === 'S' ? 'bg-gold-bright' :
                  signal.grade === 'A' ? 'bg-positive' :
                  signal.grade === 'B' ? 'bg-[#4A6080]' :
                  'bg-border-dim'
                }`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-sm bg-gold-ghost px-1.5 py-0.5 font-mono text-[10px] font-bold text-gold-bright">{signal.grade}</span>
                    <span className="font-body text-sm font-medium text-parchment">{signal.tokenSymbol}</span>
                    <span className="text-xs text-muted">{signal.pattern}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-mono text-xs text-muted">{timeAgo(signal.timestamp)}</span>
                <span className="font-mono text-sm text-parchment">${formatPrice(signal.priceUsd)}</span>
                <span className="font-mono text-xs text-positive">{formatPercent(signal.priceChange1h)}</span>
                <span className="font-mono text-xs text-muted">{signal.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
