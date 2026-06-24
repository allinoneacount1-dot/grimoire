import { LayoutDashboard, Zap, Search, Eye, Newspaper, MessageSquare } from 'lucide-react';
import { useGrimoireStore } from '../../store/grimoire.store';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'signals', label: 'Signal Feed', icon: Zap },
  { id: 'scanner', label: 'Token Scanner', icon: Search },
  { id: 'wallets', label: 'Wallet Tracker', icon: Eye },
  { id: 'news', label: 'News Intel', icon: Newspaper },
  { id: 'oracle', label: 'Oracle Chat', icon: MessageSquare },
];

export default function Sidebar() {
  const { activeSection, setActiveSection, signalEngineStatus, lastSignalScan } = useGrimoireStore();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border-subtle bg-deep p-3 flex flex-col">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body transition-all ${
              activeSection === item.id
                ? 'bg-gold-ghost border-l-2 border-gold-bright text-gold-bright'
                : 'text-muted hover:bg-elevated hover:text-parchment'
            }`}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-border-subtle">
        <div className="flex items-center gap-2 px-3 mb-2">
          <span className={`h-1.5 w-1.5 rounded-full ${signalEngineStatus === 'active' ? 'bg-positive animate-pulse-gold' : 'bg-negative'}`} />
          <span className="text-[11px] text-muted">Signal Engine: {signalEngineStatus === 'active' ? 'ACTIVE' : signalEngineStatus.toUpperCase()}</span>
        </div>
        {lastSignalScan > 0 && (
          <span className="font-mono text-[10px] text-text-tertiary px-3">
            Last scan: {Math.floor((Date.now() - lastSignalScan) / 1000)}s ago
          </span>
        )}
      </div>
    </aside>
  );
}
