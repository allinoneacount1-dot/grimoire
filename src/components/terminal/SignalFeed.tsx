import { useGrimoireStore } from '../../store/grimoire.store';
import { formatPrice, formatPercent, formatCompact, timeAgo } from '../../lib/formatters';

export default function SignalFeed() {
  const { signals, signalFilter, setSignalFilter } = useGrimoireStore();

  const filtered = signals.filter((s) => {
    if (!signalFilter.grades.includes(s.grade)) return false;
    if (s.volume24h < signalFilter.minVolume) return false;
    return true;
  });

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-2">
        {filtered.map((signal) => (
          <div
            key={signal.id}
            className="rounded-md border border-border-subtle bg-surface p-5 hover:bg-elevated transition-colors"
            style={{ borderLeftWidth: '3px', borderLeftColor: signal.grade === 'S' ? 'var(--gold-bright)' : signal.grade === 'A' ? 'var(--positive)' : signal.grade === 'B' ? '#4A6080' : 'var(--border-dim)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-sm bg-gold-ghost px-1.5 py-0.5 font-mono text-[10px] font-bold text-gold-bright">{signal.grade}</span>
                <span className="font-body text-sm font-medium text-parchment">{signal.tokenSymbol}</span>
                <span className="text-xs text-muted">{signal.tokenName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-text-tertiary">{timeAgo(signal.timestamp)}</span>
                <span className="text-[10px] text-muted uppercase">solana</span>
              </div>
            </div>
            <h4 className="font-display text-lg text-parchment mb-1">{signal.pattern}</h4>
            <p className="text-sm text-muted mb-3">{signal.description}</p>
            <div className="flex items-center gap-6">
              <span className="font-mono text-sm text-parchment">${formatPrice(signal.priceUsd)}</span>
              <span className={`font-mono text-xs ${signal.priceChange1h >= 0 ? 'text-positive' : 'text-rose-bright'}`}>{formatPercent(signal.priceChange1h)}</span>
              <span className="font-mono text-xs text-muted">Vol: ${formatCompact(signal.volume24h)}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-border-subtle rounded-full overflow-hidden">
                  <div className="h-full bg-gold-bright rounded-full" style={{ width: `${signal.confidence}%` }} />
                </div>
                <span className="font-mono text-[10px] text-muted">{signal.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter sidebar */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <div className="rounded-md border border-border-subtle bg-surface p-4">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">Grade Filter</h4>
          <div className="flex gap-2">
            {(['S', 'A', 'B', 'C'] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => {
                  const grades = signalFilter.grades.includes(grade)
                    ? signalFilter.grades.filter((g) => g !== grade)
                    : [...signalFilter.grades, grade];
                  setSignalFilter({ grades });
                }}
                className={`flex-1 py-1.5 rounded-sm font-mono text-xs font-bold transition-colors ${
                  signalFilter.grades.includes(grade)
                    ? grade === 'S' ? 'bg-gold-bright text-void' : grade === 'A' ? 'bg-positive text-void' : grade === 'B' ? 'bg-[#4A6080] text-parchment' : 'bg-border-dim text-parchment'
                    : 'bg-border-subtle text-muted hover:bg-elevated'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-border-subtle bg-surface p-4">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-3">Min Volume</h4>
          <input
            type="range"
            min="0"
            max="1000000"
            step="10000"
            value={signalFilter.minVolume}
            onChange={(e) => setSignalFilter({ minVolume: Number(e.target.value) })}
            className="w-full accent-gold-bright"
          />
          <span className="font-mono text-xs text-muted">${formatCompact(signalFilter.minVolume)}</span>
        </div>
      </div>
    </div>
  );
}
