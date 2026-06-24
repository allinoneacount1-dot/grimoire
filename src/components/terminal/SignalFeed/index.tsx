import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrimoireStore } from '../../../store/grimoire.store';
import { formatPrice, formatPercent, formatTimeAgo } from '../../../lib/formatters';
import { GRADE_COLORS } from '../../../types/signal.types';
import type { SignalGrade } from '../../../types/signal.types';
import { Search } from 'lucide-react';

export function SignalFeed() {
  const signals = useGrimoireStore((s) => s.signals);
  const signalFilter = useGrimoireStore((s) => s.signalFilter);
  const setSignalFilter = useGrimoireStore((s) => s.setSignalFilter);
  const setScannedToken = useGrimoireStore((s) => s.setScannedToken);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSignals = signals
    .filter((s) => signalFilter.grades.includes(s.grade))
    .filter((s) => s.metrics.liquidity >= signalFilter.minVolume)
    .filter((s) => {
      if (signalFilter.maxAge === 999) return true;
      return s.metrics.ageHours <= signalFilter.maxAge;
    })
    .filter((s) => {
      if (!searchQuery) return true;
      return s.token.baseToken.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.patternName.toLowerCase().includes(searchQuery.toLowerCase());
    });

  const handleScanToken = (signal: typeof signals[0]) => {
    setScannedToken(signal.token);
    navigate('/terminal/scanner');
  };

  const toggleGrade = (grade: SignalGrade) => {
    const grades = signalFilter.grades.includes(grade)
      ? signalFilter.grades.filter((g) => g !== grade)
      : [...signalFilter.grades, grade];
    setSignalFilter({ grades });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Signal List */}
        <div className="space-y-2">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter signals..."
              className="w-full h-10 pl-10 pr-4 bg-surface border border-[var(--border-dim)] text-parchment font-body text-sm placeholder:text-muted focus:border-gold-dim focus:outline-none transition-colors"
              style={{ borderRadius: '2px' }}
            />
          </div>

          {/* Signal Cards */}
          {filteredSignals.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-mono text-sm text-muted">No signals matching your filters</p>
            </div>
          ) : (
            filteredSignals.map((signal) => {
              const colors = GRADE_COLORS[signal.grade];
              return (
                <div
                  key={signal.id}
                  className={`bg-surface border border-[var(--border-subtle)] border-l-[3px] ${colors.border} p-5 hover:bg-elevated transition-colors duration-150 cursor-pointer`}
                  style={{ borderRadius: '4px' }}
                  onClick={() => handleScanToken(signal)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 ${colors.text} ${colors.bg}`}
                      style={{ borderRadius: '2px' }}
                    >
                      {signal.grade}
                    </span>
                    <span className="font-mono text-sm text-parchment font-medium">
                      ${signal.token.baseToken.symbol}
                    </span>
                    <span className="font-body text-xs text-muted">
                      {signal.token.baseToken.name}
                    </span>
                    <span className="font-mono text-xs text-muted ml-auto">
                      {formatTimeAgo(signal.timestamp)}
                    </span>
                    <span className="font-mono text-[10px] text-muted uppercase px-1.5 py-0.5 bg-elevated" style={{ borderRadius: '2px' }}>
                      solana
                    </span>
                  </div>

                  <h4 className="font-display text-lg text-parchment mb-1">
                    {signal.patternName}
                  </h4>
                  <p className="font-body text-sm text-muted mb-3">
                    {signal.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="font-mono text-parchment tabular-nums">
                      {formatPrice(parseFloat(signal.token.priceUsd))}
                    </span>
                    <span className={`font-mono tabular-nums ${
                      signal.metrics.priceChange1h >= 0 ? 'text-positive' : 'text-rose-bright'
                    }`}>
                      {formatPercent(signal.metrics.priceChange1h)}
                    </span>
                    <span className="font-mono text-muted tabular-nums">
                      Vol: ${(signal.metrics.volumeChange1h / 1000).toFixed(0)}k
                    </span>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                      <span className="text-muted">Confidence:</span>
                      <div className="w-16 h-1.5 bg-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-bright"
                          style={{ width: `${signal.confidence}%` }}
                        />
                      </div>
                      <span className="font-mono text-gold-dim tabular-nums">{signal.confidence.toFixed(0)}%</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScanToken(signal);
                      }}
                      className="text-gold-dim hover:text-gold-bright transition-colors font-mono cursor-pointer bg-transparent border-none"
                    >
                      Scan Token →
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Filter Panel */}
        <div className="space-y-6">
          <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">Grade</span>
            <div className="flex flex-wrap gap-2">
              {(['S', 'A', 'B', 'C'] as SignalGrade[]).map((grade) => {
                const colors = GRADE_COLORS[grade];
                const isActive = signalFilter.grades.includes(grade);
                return (
                  <button
                    key={grade}
                    onClick={() => toggleGrade(grade)}
                    className={`w-10 h-10 font-mono text-sm font-bold transition-all cursor-pointer border ${
                      isActive
                        ? `${colors.text} ${colors.bg} border-current`
                        : 'text-muted bg-elevated border-transparent hover:border-[var(--border-dim)]'
                    }`}
                    style={{ borderRadius: '2px' }}
                  >
                    {grade}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">Min Volume</span>
            <input
              type="range"
              min={0}
              max={1000000}
              step={10000}
              value={signalFilter.minVolume}
              onChange={(e) => setSignalFilter({ minVolume: Number(e.target.value) })}
              className="w-full accent-gold-bright"
            />
            <div className="flex justify-between mt-1">
              <span className="font-mono text-xs text-muted">$0</span>
              <span className="font-mono text-xs text-muted">${(signalFilter.minVolume / 1000).toFixed(0)}k</span>
            </div>
          </div>

          <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">Token Age</span>
            <div className="space-y-1">
              {[{ label: '< 1h', value: 1 }, { label: '< 24h', value: 24 }, { label: '< 7d', value: 168 }, { label: 'Any', value: 999 }].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSignalFilter({ maxAge: opt.value })}
                  className={`w-full text-left px-3 py-2 font-mono text-xs transition-colors cursor-pointer bg-transparent border-none ${
                    signalFilter.maxAge === opt.value
                      ? 'text-gold-bright bg-gold-ghost'
                      : 'text-muted hover:bg-elevated'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-[var(--border-subtle)] p-4" style={{ borderRadius: '4px' }}>
            <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-3">Sort By</span>
            <div className="space-y-1">
              {['latest', 'grade', 'volume', 'confidence'].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSignalFilter({ sortBy: sort as typeof signalFilter.sortBy })}
                  className={`w-full text-left px-3 py-2 font-mono text-xs capitalize transition-colors cursor-pointer bg-transparent border-none ${
                    signalFilter.sortBy === sort
                      ? 'text-gold-bright bg-gold-ghost'
                      : 'text-muted hover:bg-elevated'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
