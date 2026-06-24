import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useGrimoireStore } from '../store/grimoire.store';
import { fetchPrices } from '../lib/api';
import { formatPrice, formatPercent } from '../lib/formatters';
import Sidebar from '../components/terminal/Sidebar';
import Overview from '../components/terminal/Overview';
import SignalFeed from '../components/terminal/SignalFeed';
import TokenScanner from '../components/terminal/TokenScanner';
import NewsIntel from '../components/terminal/NewsIntel';
import OracleChat from '../components/terminal/OracleChat';
import WalletTracker from '../components/terminal/WalletTracker';

function TopBar() {
  const { data: prices } = useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    refetchInterval: 30000,
  });

  const { setCommandBarOpen } = useGrimoireStore();

  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-border-subtle bg-deep">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-display text-lg font-semibold text-gold-bright">GRIMOIRE</Link>
        <div className="hidden md:flex items-center gap-4 ml-4">
          {[
            { symbol: 'BTC', data: prices?.bitcoin },
            { symbol: 'ETH', data: prices?.ethereum },
            { symbol: 'SOL', data: prices?.solana },
          ].map((item) => (
            <div key={item.symbol} className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted">{item.symbol}</span>
              <span className="font-mono text-xs font-medium text-parchment">${formatPrice(item.data?.usd || 0)}</span>
              <span className={`font-mono text-[10px] ${(item.data?.change24h || 0) >= 0 ? 'text-positive' : 'text-rose-bright'}`}>
                {formatPercent(item.data?.change24h || 0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setCommandBarOpen(true)}
          className="hidden md:flex items-center gap-2 rounded-sm border border-border-dim bg-surface px-4 py-1.5 text-xs text-muted hover:border-border-active transition-colors w-64"
        >
          <span>⌘ Search or command...</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse-gold" />
          <span className="font-mono text-[10px] text-muted">SOL MAINNET</span>
        </div>
        <Settings className="h-4 w-4 text-muted hover:text-parchment cursor-pointer transition-colors" />
        <Link to="/" className="flex items-center gap-1 text-xs text-muted hover:text-parchment transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Exit
        </Link>
      </div>
    </div>
  );
}

export default function Terminal() {
  const { activeSection } = useGrimoireStore();

  const renderSection = () => {
    switch (activeSection) {
      case 'signals': return <SignalFeed />;
      case 'scanner': return <TokenScanner />;
      case 'wallets': return <WalletTracker />;
      case 'news': return <NewsIntel />;
      case 'oracle': return <OracleChat />;
      default: return <Overview />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-void">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
