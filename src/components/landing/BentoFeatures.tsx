import { useEffect, useState } from 'react';
import { Zap, Eye, Newspaper } from 'lucide-react';
import { useTrendingTokens } from '../../hooks/useTrendingTokens';
import { useMarketData } from '../../hooks/useMarketData';
import { formatPrice, formatPercent } from '../../lib/formatters';

const oracleResponses = [
  'Pattern analysis indicates stealth accumulation in the 4H window. Wallet cluster 0x7f3a shows consistent buys across 3 tokens.',
  'Volume anomaly detected. Unusual buy pressure suggests pre-event positioning. Confidence: 78%.',
  'Cross-referencing wallet behaviors. Smart money movement pattern matches historical breakout setup.',
];

export function BentoFeatures() {
  const [oracleIndex, setOracleIndex] = useState(0);
  const { tokens } = useTrendingTokens();
  const { marketData } = useMarketData();
  const sol = marketData?.find((m) => m.id === 'solana');

  useEffect(() => {
    const interval = setInterval(() => {
      setOracleIndex((prev) => (prev + 1) % oracleResponses.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-[clamp(80px,12vh,160px)]">
      <div className="shell">
        <div className="mb-12">
          <span className="font-mono text-xs text-gold-dim tracking-[0.25em] uppercase">
            What GRIMOIRE Reads
          </span>
        </div>

        <div
          className="grid grid-cols-12 gap-4"
          style={{ gridAutoRows: 'minmax(180px, auto)' }}
        >
          {/* Cell A — Pattern Detection (6 cols, 2 rows) */}
          <div
            className="col-span-12 md:col-span-6 row-span-2 p-7 bg-surface border border-[var(--border-subtle)] hover:bg-elevated transition-colors duration-150 group"
            style={{ borderRadius: '4px' }}
          >
            <h3 className="font-display text-xl text-parchment mb-2">
              Pattern Detection
            </h3>
            <p className="font-body text-sm text-muted mb-6">
              The AI reads 14 behavioral pattern classes across every Solana token.
            </p>
            <div className="space-y-2">
              {tokens.slice(0, 5).map((token) => (
                <div
                  key={token.pairAddress}
                  className="flex items-center justify-between py-2 px-3 bg-deep border-l-2 border-gold-dim group-hover:border-gold-bright transition-colors"
                >
                  <span className="font-mono text-xs text-parchment truncate max-w-[120px]">
                    ${token.baseToken.symbol}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1.5 bg-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold-bright"
                        style={{ width: `${60 + Math.random() * 35}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-gold-dim w-10 text-right">
                      {(60 + Math.random() * 35).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cell B — Signal Engine (3 cols) */}
          <div
            className="col-span-6 md:col-span-3 p-7 bg-surface border border-[var(--border-subtle)] hover:bg-elevated transition-colors duration-150"
            style={{ borderRadius: '4px' }}
          >
            <Zap className="w-5 h-5 text-gold-bright mb-3" />
            <h3 className="font-display text-lg text-parchment mb-2">
              Graded Signals
            </h3>
            <p className="font-body text-sm text-muted">
              Every signal rated S / A / B / C. Only S and A-grade surface by default.
            </p>
          </div>

          {/* Cell C — Wallet Intelligence (3 cols) */}
          <div
            className="col-span-6 md:col-span-3 p-7 bg-surface border border-[var(--border-subtle)] hover:bg-elevated transition-colors duration-150"
            style={{ borderRadius: '4px' }}
          >
            <Eye className="w-5 h-5 text-gold-bright mb-3" />
            <h3 className="font-display text-lg text-parchment mb-2">
              Whale Forensics
            </h3>
            <p className="font-body text-sm text-muted">
              Track smart wallet accumulation before price reacts.
            </p>
          </div>

          {/* Cell D — Oracle AI (6 cols) */}
          <div
            className="col-span-12 md:col-span-6 p-7 bg-surface border border-[var(--border-subtle)] hover:bg-elevated transition-colors duration-150"
            style={{ borderRadius: '4px' }}
          >
            <h3 className="font-display text-2xl text-parchment mb-4">
              Ask the Oracle anything about any Solana token.
            </h3>
            <div className="bg-deep p-4 border border-[var(--border-dim)] mb-3" style={{ borderRadius: '2px' }}>
              <p className="font-mono text-sm text-muted">
                {'> Analyze the wallet clustering pattern of $BONK in the last 24h'}
              </p>
            </div>
            <p className="font-display text-base text-gold-dim italic leading-relaxed">
              {oracleResponses[oracleIndex]}
            </p>
          </div>

          {/* Cell E — News Intelligence (3 cols) */}
          <div
            className="col-span-6 md:col-span-3 p-7 bg-surface border border-[var(--border-subtle)] hover:bg-elevated transition-colors duration-150"
            style={{ borderRadius: '4px' }}
          >
            <Newspaper className="w-5 h-5 text-gold-bright mb-3" />
            <h3 className="font-display text-lg text-parchment mb-2">
              Narrative Tracking
            </h3>
            <p className="font-body text-sm text-muted">
              Live crypto news filtered for signal density. Slop filtered out.
            </p>
          </div>

          {/* Cell F — Real-Time Data (3 cols) */}
          <div
            className="col-span-6 md:col-span-3 p-7 bg-surface border border-[var(--border-subtle)] hover:bg-elevated transition-colors duration-150"
            style={{ borderRadius: '4px' }}
          >
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              SOL Price
            </span>
            <p className="font-mono text-3xl text-parchment mt-2 tabular-nums">
              {sol ? formatPrice(sol.current_price) : '—'}
            </p>
            {sol && (
              <span
                className={`font-mono text-sm tabular-nums ${
                  sol.price_change_percentage_24h >= 0 ? 'text-positive' : 'text-rose-bright'
                }`}
              >
                {formatPercent(sol.price_change_percentage_24h)}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
