import { useState } from 'react';
import { useGrimoireStore } from '../../store/grimoire.store';
import { formatAddress } from '../../lib/formatters';
import { Copy, Trash2 } from 'lucide-react';

export default function WalletTracker() {
  const { trackedWallets, addTrackedWallet, removeTrackedWallet } = useGrimoireStore();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.length >= 32 && !trackedWallets.includes(input)) {
      addTrackedWallet(input);
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="font-display text-xl font-semibold text-parchment text-center">Wallet Tracker</h2>

      {/* Add wallet */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Paste Solana wallet address..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 bg-surface border border-border-dim rounded-none px-4 py-3 font-mono text-sm text-parchment placeholder:text-text-tertiary focus:outline-none focus:border-border-active"
        />
        <button
          onClick={handleAdd}
          disabled={input.length < 32}
          className="rounded-sm bg-gold-bright px-5 py-3 text-sm font-medium text-void hover:bg-gold-dim transition-colors disabled:opacity-30"
        >
          Add Wallet
        </button>
      </div>

      {/* Tracked wallets */}
      {trackedWallets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted mb-2">No wallets tracked yet.</p>
          <p className="text-xs text-text-tertiary">Paste a Solana wallet address above to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {trackedWallets.map((addr) => (
            <div key={addr} className="flex items-center justify-between rounded-md border border-border-subtle bg-surface px-5 py-4 hover:bg-elevated transition-colors group">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-elevated flex items-center justify-center">
                  <span className="font-mono text-xs text-gold-dim">{addr[0]}</span>
                </div>
                <div>
                  <div className="font-mono text-sm text-parchment">{formatAddress(addr, 6)}</div>
                  <div className="text-xs text-muted">Tracking</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigator.clipboard.writeText(addr)}
                  className="text-muted hover:text-parchment transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeTrackedWallet(addr)}
                  className="text-muted hover:text-rose-bright transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
