import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, Search, Eye, Newspaper, MessageSquare } from 'lucide-react';
import { useGrimoireStore } from '../../store/grimoire.store';

const navItems = [
  { path: '/terminal', icon: LayoutDashboard, label: 'Overview' },
  { path: '/terminal/signals', icon: Zap, label: 'Signal Feed' },
  { path: '/terminal/scanner', icon: Search, label: 'Token Scanner' },
  { path: '/terminal/wallets', icon: Eye, label: 'Wallet Tracker' },
  { path: '/terminal/news', icon: Newspaper, label: 'News Intel' },
  { path: '/terminal/oracle', icon: MessageSquare, label: 'Oracle Chat' },
];

export function Sidebar() {
  const location = useLocation();
  const signalEngineStatus = useGrimoireStore((s) => s.signalEngineStatus);
  const lastSignalScan = useGrimoireStore((s) => s.lastSignalScan);

  const getTimeSince = () => {
    if (!lastSignalScan) return '—';
    const seconds = Math.floor((Date.now() - lastSignalScan) / 1000);
    return `${seconds}s ago`;
  };

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[220px] bg-deep border-r border-[var(--border-subtle)] flex flex-col py-4 px-3">
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm no-underline transition-colors duration-150 ${
                isActive
                  ? 'bg-gold-ghost border-l-2 border-gold-bright text-gold-bright'
                  : 'border-l-2 border-transparent text-muted hover:bg-elevated hover:text-parchment'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="font-body">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
        <div className="flex items-center gap-2 px-3">
          <div className={`w-2 h-2 rounded-full ${signalEngineStatus === 'active' ? 'bg-positive animate-pulse-gold' : 'bg-negative'}`} />
          <span className="font-mono text-xs text-muted">
            Signal Engine: {signalEngineStatus === 'active' ? 'ACTIVE' : signalEngineStatus.toUpperCase()}
          </span>
        </div>
        <div className="px-3">
          <span className="font-mono text-xs text-muted">
            Last scan: {getTimeSince()}
          </span>
        </div>
      </div>
    </aside>
  );
}
