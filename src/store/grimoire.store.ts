import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Token, Signal, NewsItem, WalletData, Message } from '../types';

interface GrimoireStore {
  prices: Record<string, { usd: number; change24h: number }>;
  setPrices: (prices: Record<string, { usd: number; change24h: number }>) => void;

  trendingTokens: Token[];
  setTrendingTokens: (tokens: Token[]) => void;
  lastTokenRefresh: number;
  setLastTokenRefresh: (time: number) => void;

  signals: Signal[];
  setSignals: (signals: Signal[]) => void;
  signalEngineStatus: 'active' | 'paused' | 'error';
  setSignalEngineStatus: (status: 'active' | 'paused' | 'error') => void;
  lastSignalScan: number;
  setLastSignalScan: (time: number) => void;

  scannedToken: Token | null;
  setScannedToken: (token: Token | null) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;

  trackedWallets: string[];
  addTrackedWallet: (address: string) => void;
  removeTrackedWallet: (address: string) => void;
  walletData: Record<string, WalletData>;
  setWalletData: (address: string, data: WalletData) => void;

  news: NewsItem[];
  setNews: (news: NewsItem[]) => void;

  oracleMessages: Message[];
  addOracleMessage: (message: Message) => void;
  oracleLoading: boolean;
  setOracleLoading: (v: boolean) => void;
  oracleContext: Token | null;
  setOracleContext: (token: Token | null) => void;

  activeSection: string;
  setActiveSection: (s: string) => void;
  commandBarOpen: boolean;
  setCommandBarOpen: (v: boolean) => void;

  signalFilter: {
    grades: ('S' | 'A' | 'B' | 'C')[];
    minVolume: number;
    maxAge: number;
  };
  setSignalFilter: (filter: Partial<GrimoireStore['signalFilter']>) => void;
}

export const useGrimoireStore = create<GrimoireStore>()(
  persist(
    (set) => ({
      prices: {},
      setPrices: (prices) => set({ prices }),

      trendingTokens: [],
      setTrendingTokens: (tokens) => set({ trendingTokens: tokens }),
      lastTokenRefresh: 0,
      setLastTokenRefresh: (time) => set({ lastTokenRefresh: time }),

      signals: [],
      setSignals: (signals) => set({ signals }),
      signalEngineStatus: 'active',
      setSignalEngineStatus: (status) => set({ signalEngineStatus: status }),
      lastSignalScan: 0,
      setLastSignalScan: (time) => set({ lastSignalScan: time }),

      scannedToken: null,
      setScannedToken: (token) => set({ scannedToken: token }),
      recentSearches: [],
      addRecentSearch: (query) =>
        set((state) => ({
          recentSearches: [
            query,
            ...state.recentSearches.filter((s) => s !== query),
          ].slice(0, 10),
        })),

      trackedWallets: [],
      addTrackedWallet: (address) =>
        set((state) => ({
          trackedWallets: [...state.trackedWallets, address],
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

      news: [],
      setNews: (news) => set({ news }),

      oracleMessages: [],
      addOracleMessage: (message) =>
        set((state) => ({
          oracleMessages: [...state.oracleMessages, message],
        })),
      oracleLoading: false,
      setOracleLoading: (v) => set({ oracleLoading: v }),
      oracleContext: null,
      setOracleContext: (token) => set({ oracleContext: token }),

      activeSection: 'overview',
      setActiveSection: (s) => set({ activeSection: s }),
      commandBarOpen: false,
      setCommandBarOpen: (v) => set({ commandBarOpen: v }),

      signalFilter: {
        grades: ['S', 'A', 'B', 'C'],
        minVolume: 0,
        maxAge: Infinity,
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
