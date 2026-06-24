import { useState } from 'react';
import { useGrimoireStore } from '../../../store/grimoire.store';
import { useWalletData } from '../../../hooks/useWalletData';
import { formatAddress, formatPrice } from '../../../lib/formatters';
import { Plus, Trash2, Copy, ExternalLink } from 'lucide-react';

export function WalletTracker() {
  const trackedWallets = useGrimoireStore((s) => s.trackedWallets);
  const addTrackedWallet = useGrimoireStore((s) => s.addTrackedWallet);
  const removeTrackedWallet = useGrimoireStore((s) => s.removeTrackedWallet);
  const [inputAddress, setInputAddress] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { walletData, isLoading } = useWalletData(selectedWallet);

  const handleAddWallet = () => {
    const addr = inputAddress.trim();
    if (addr.length > 30 && addr.length < 50) {
      addTrackedWallet(addr);
      setInputAddress('');
      setSelectedWallet(addr);
    }
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        {/* Wallet List */}
        <div className="space-y-4">
          {/* Add Wallet Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWallet()}
              placeholder="Paste wallet address..."
              className="flex-1 h-10 px-4 bg-surface border border-[var(--border-dim)] text-parchment font-mono text-xs placeholder:text-muted focus:border-gold-dim focus:outline-none transition-colors"
              style={{ borderRadius: '2px' }}
            />
            <button
              onClick={handleAddWallet}
              disabled={!inputAddress.trim()}
              className="w-10 h-10 flex items-center justify-center bg-gold-bright text-void hover:bg-gold-dim transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderRadius: '2px' }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Wallet List */}
          <div className="bg-surface border border-[var(--border-subtle)] overflow-hidden" style={{ borderRadius: '4px' }}>
            {trackedWallets.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-mono text-xs text-muted">No wallets tracked yet</p>
                <p className="font-body text-xs text-muted mt-1">Add a Solana wallet address to begin</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {trackedWallets.map((address) => {
                  const data = useGrimoireStore.getState().walletData[address];
                  return (
                    <div
                      key={address}
                      onClick={() => setSelectedWallet(address)}
                      className={`p-4 cursor-pointer transition-colors duration-150 border-l-2 ${
                        selectedWallet === address
                          ? 'bg-elevated border-l-gold-bright'
                          : 'border-l-transparent hover:bg-elevated'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs text-parchment">{formatAddress(address, 6)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTrackedWallet(address);
                          }}
                          className="text-muted hover:text-rose-bright transition-colors cursor-pointer bg-transparent border-none"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      {data && (
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-mono text-muted">{data.solBalance.toFixed(2)} SOL</span>
                          <span className="font-mono text-muted">{data.tokenCount} tokens</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Wallet Detail */}
        {selectedWallet ? (
          <div className="space-y-4">
            {isLoading ? (
              <div className="bg-surface border border-[var(--border-subtle)] p-6 animate-pulse" style={{ borderRadius: '4px' }}>
                <div className="w-48 h-6 bg-elevated rounded mb-4" />
                <div className="w-32 h-10 bg-elevated rounded" />
              </div>
            ) : walletData ? (
              <>
                {/* Wallet Header */}
                <div className="bg-surface border border-[var(--border-subtle)] p-5" style={{ borderRadius: '4px' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-muted uppercase tracking-wider">Wallet Address</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(selectedWallet)}
                        className="text-muted hover:text-gold-bright transition-colors cursor-pointer bg-transparent border-none"
                      >
                        <Copy className="w-4 h-4" />
                        {copied && <span className="text-xs text-gold-bright ml-1">Copied!</span>}
                      </button>
                      <a
                        href={`https://solscan.io/account/${selectedWallet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-gold-bright transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-parchment break-all">{selectedWallet}</p>
                  <p className="font-mono text-2xl text-parchment mt-3 tabular-nums">
                    {walletData.solBalance.toFixed(4)} SOL
                  </p>
                </div>

                {/* Token Holdings */}
                <div className="bg-surface border border-[var(--border-subtle)] overflow-hidden" style={{ borderRadius: '4px' }}>
                  <div className="px-5 py-3 border-b border-[var(--border-subtle)]">
                    <span className="font-mono text-xs text-muted uppercase tracking-wider">Token Holdings</span>
                  </div>
                  {walletData.tokenHoldings.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="font-mono text-xs text-muted">No token accounts found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[var(--border-subtle)]">
                            <th className="px-5 py-2 text-left font-mono text-xs text-muted uppercase tracking-wider font-normal">Token</th>
                            <th className="px-5 py-2 text-right font-mono text-xs text-muted uppercase tracking-wider font-normal">Balance</th>
                            <th className="px-5 py-2 text-right font-mono text-xs text-muted uppercase tracking-wider font-normal">USD Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {walletData.tokenHoldings.slice(0, 10).map((holding: { mint: string; symbol: string; balance: number; usdValue: number; percentage: number }) => (
                            <tr key={holding.mint} className="border-b border-[var(--border-subtle)]">
                              <td className="px-5 py-3 font-mono text-sm text-parchment">{holding.symbol}</td>
                              <td className="px-5 py-3 text-right font-mono text-sm text-parchment tabular-nums">{holding.balance.toFixed(2)}</td>
                              <td className="px-5 py-3 text-right font-mono text-sm text-muted tabular-nums">
                                {holding.usdValue > 0 ? formatPrice(holding.usdValue) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="font-mono text-sm text-muted">Select a wallet to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
