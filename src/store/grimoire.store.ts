import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DexToken } from '../types/token.types';
import type { Signal, SignalFilter } from '../types/signal.types';
import type { WalletData } from '../types/wallet.types';
import type { NewsItem } from '../types/news.types';
import type { Message } from '../types/message.types';

interface GrimoireStore {
  prices: Record<string, { usd: number; change24h: number }>;
  setPrices: (prices: Record<string, { usd: number; change24h: number }>) => void;

  trendingTokens: DexToken[];
  setTrendingTokens: (tokens: DexToken[]) => void;
  lastTokenRefresh: number;

  signals: Signal[];
  setSignals: (signals: Signal[]) => void;
  signalEngineStatus: 'active' | 'paused' | 'error';
  lastSignalScan: number;

  scannedToken: DexToken | null;
  setScannedToken: (token: DexToken | null) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;

  trackedWallets: string[];
  addTrackedWallet: (address: string) => void;
  removeTrackedWallet: (address: string) => void;
  walletData: Record<string, WalletData>;
  setWalletData: (address: string, data: WalletData) => void;

  oracleMessages: Message[];
  addOracleMessage: (message: Message) => void;
  oracleLoading: boolean;
  setOracleLoading: (v: boolean) => void;
  oracleContext: DexToken | null;

  news: NewsItem[];
  setNews: (news: NewsItem[]) => void;

  activeSection: 'overview' | 'signals' | 'scanner' | 'wallets' | 'news' | 'oracle';
  setActiveSection: (s: string) => void;
  commandBarOpen: boolean;
  setCommandBarOpen: (v: boolean) => void;

  signalFilter: SignalFilter;
  setSignalFilter: (filter: Partial<SignalFilter>) => void;
}

export const useGrimoireStore = create<GrimoireStore>()(
  persist(
    (set) => ({
      prices: {},
      setPrices: (prices) => set({ prices }),

      trendingTokens: [],
      setTrendingTokens: (tokens) => set({ trendingTokens: tokens, lastTokenRefresh: Date.now() }),
      lastTokenRefresh: 0,

      signals: [],
      setSignals: (signals) => set({ signals, lastSignalScan: Date.now() }),
      signalEngineStatus: 'active',
      lastSignalScan: 0,

      scannedToken: null,
      setScannedToken: (token) => set({ scannedToken: token }),
      recentSearches: [],
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [query, ...state.recentSearches.filter((s) => s !== query)].slice(0, 10),
        })),

      trackedWallets: [],
      addTrackedWallet: (address) =>
        set((state) => ({
          trackedWallets: [...new Set([...state.trackedWallets, address])],
        })),
      removeTrackedWallet: (address) =>
        set((state) => ({
          trackedWallets: state.trackedWallets.filter((w) => w !== address),
        })),
      walletData: {},
      setWalletData: (address, data) =>
        set((state) => ({
          walletData: { ...state.walletData, [address]: data },
        })),

      oracleMessages: [],
      addOracleMessage: (message) =>
        set((state) => ({
          oracleMessages: [...state.oracleMessages, message],
        })),
      oracleLoading: false,
      setOracleLoading: (v) => set({ oracleLoading: v }),
      oracleContext: null,

      news: [],
      setNews: (news) => set({ news }),

      activeSection: 'overview',
      setActiveSection: (s) => set({ activeSection: s as GrimoireStore['activeSection'] }),
      commandBarOpen: false,
      setCommandBarOpen: (v) => set({ commandBarOpen: v }),

      signalFilter: {
        grades: ['S', 'A', 'B', 'C'],
        minVolume: 0,
        maxAge: 999,
        sortBy: 'latest',
      },
      setSignalFilter: (filter) =>
        set((state) => ({
          signalFilter: { ...state.signalFilter, ...filter },
        })),
    }),
    {
      name: 'grimoire-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        trackedWallets: state.trackedWallets,
        signalFilter: state.signalFilter,
      }),
    }
  )
);
