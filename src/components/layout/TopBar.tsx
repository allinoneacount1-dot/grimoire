import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Search } from 'lucide-react';
import { useGrimoireStore } from '../../store/grimoire.store';
import { formatPrice } from '../../lib/formatters';

export function TopBar() {
  const prices = useGrimoireStore((s) => s.prices);
  const setCommandBarOpen = useGrimoireStore((s) => s.setCommandBarOpen);
  const [flash, setFlash] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const prevPrices = { ...prices };
    const newFlash: Record<string, boolean> = {};
    
    Object.entries(prices).forEach(([key, val]) => {
      if (prevPrices[key] && prevPrices[key].usd !== val.usd) {
        newFlash[key] = true;
      }
    });
    
    if (Object.keys(newFlash).length > 0) {
      setFlash(newFlash);
      setTimeout(() => setFlash({}), 300);
    }
  }, [prices]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-deep border-b border-[var(--border-subtle)]">
      <div className="h-full flex items-center px-4 gap-6">
        <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-gold-bright" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="font-display text-lg font-semibold text-gold-bright">GRIMOIRE</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {['bitcoin', 'ethereum', 'solana'].map((asset) => (
            <div key={asset} className="flex items-center gap-1.5">
              <span className="text-muted uppercase">{asset.slice(0, 3)}</span>
              <span className={`font-mono text-parchment tabular-nums transition-colors duration-200 ${flash[asset] ? 'text-gold-bright' : ''}`}>
                {prices[asset] ? formatPrice(prices[asset].usd) : '—'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1 flex justify-center">
          <button
            onClick={() => setCommandBarOpen(true)}
            className="flex items-center gap-2 w-[320px] h-9 px-3 bg-surface border border-[var(--border-dim)] text-muted text-sm hover:border-gold-dim transition-colors duration-150 cursor-pointer"
            style={{ borderRadius: '2px' }}
          >
            <Search className="w-4 h-4" />
            <span>Search or command...</span>
            <span className="ml-auto font-mono text-xs text-muted">⌘K</span>
          </button>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-positive animate-pulse-gold" />
            <span className="font-mono text-xs text-muted">SOL MAINNET · 245ms</span>
          </div>
          <button className="text-muted hover:text-gold-bright transition-colors duration-150 cursor-pointer bg-transparent border-none">
            <Settings className="w-4 h-4" />
          </button>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-muted hover:text-gold-bright transition-colors duration-150 text-sm no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Terminal
          </Link>
        </div>
      </div>
    </header>
  );
}
