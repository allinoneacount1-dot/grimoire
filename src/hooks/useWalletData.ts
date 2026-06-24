import { useQuery } from '@tanstack/react-query';
import { useGrimoireStore } from '../store/grimoire.store';
import { useEffect } from 'react';

const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY;
const HELIUS_RPC = HELIUS_API_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : null;

async function fetchWalletData(address: string) {
  if (!HELIUS_RPC) {
    return {
      address,
      solBalance: 0,
      tokenCount: 0,
      lastActivity: Date.now(),
      tokenHoldings: [],
      recentTransactions: [],
    };
  }

  try {
    const [balanceResp, tokensResp] = await Promise.all([
      fetch(HELIUS_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [address],
        }),
      }),
      fetch(HELIUS_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenAccountsByOwner',
          params: [
            address,
            { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
            { encoding: 'jsonParsed' },
          ],
        }),
      }),
    ]);

    const balanceData = await balanceResp.json();
    const tokensData = await tokensResp.json();

    return {
      address,
      solBalance: (balanceData.result?.value || 0) / 1e9,
      tokenCount: tokensData.result?.value?.length || 0,
      lastActivity: Date.now(),
      tokenHoldings: (tokensData.result?.value || []).map((t: {
        account: { data: { parsed: { info: { symbol: string; tokenAmount: { uiAmount: number }; mint: string } } } };
      }) => ({
        mint: t.account.data.parsed.info.mint,
        symbol: t.account.data.parsed.info.symbol || 'Unknown',
        balance: t.account.data.parsed.info.tokenAmount.uiAmount || 0,
        usdValue: 0,
        percentage: 0,
      })),
      recentTransactions: [],
    };
  } catch {
    return {
      address,
      solBalance: 0,
      tokenCount: 0,
      lastActivity: Date.now(),
      tokenHoldings: [],
      recentTransactions: [],
    };
  }
}

export function useWalletData(address: string | null) {
  const setWalletData = useGrimoireStore((s) => s.setWalletData);

  const { data, isLoading } = useQuery({
    queryKey: ['wallet', address],
    queryFn: () => fetchWalletData(address!),
    enabled: !!address,
    staleTime: 30000,
  });

  useEffect(() => {
    if (data && address) {
      setWalletData(address, data);
    }
  }, [data, address, setWalletData]);

  return { walletData: data, isLoading };
}
