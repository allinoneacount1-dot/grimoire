import type { DexToken } from '../../types/token.types';

const BASE_URL = 'https://api.dexscreener.com';
let lastRequestTime = 0;
const MIN_INTERVAL = 1000;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
  return fetch(url);
}

export async function searchTokens(query: string): Promise<DexToken[]> {
  const response = await rateLimitedFetch(`${BASE_URL}/latest/dex/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search tokens');
  const data = await response.json();
  return (data.pairs || []).filter((pair: DexToken) => pair.chainId === 'solana');
}

export async function getTokenByAddress(address: string): Promise<DexToken | null> {
  const response = await rateLimitedFetch(`${BASE_URL}/latest/dex/tokens/${address}`);
  if (!response.ok) throw new Error('Failed to fetch token');
  const data = await response.json();
  const pairs = (data.pairs || []).filter((pair: DexToken) => pair.chainId === 'solana');
  return pairs[0] || null;
}

export async function getTrendingTokens(): Promise<DexToken[]> {
  const response = await rateLimitedFetch(`${BASE_URL}/token-profiles/latest/v1`);
  if (!response.ok) throw new Error('Failed to fetch trending tokens');
  const data = await response.json();
  const solanaTokens = data.filter((token: { chainId: string }) => token.chainId === 'solana');
  
  const tokenDetails = await Promise.all(
    solanaTokens.slice(0, 20).map(async (token: { tokenAddress: string }) => {
      try {
        const detail = await getTokenByAddress(token.tokenAddress);
        return detail;
      } catch {
        return null;
      }
    })
  );
  
  return tokenDetails.filter((t): t is DexToken => t !== null);
}

export async function getPairByAddress(pairAddress: string): Promise<DexToken | null> {
  const response = await rateLimitedFetch(`${BASE_URL}/latest/dex/pairs/solana/${pairAddress}`);
  if (!response.ok) throw new Error('Failed to fetch pair');
  const data = await response.json();
  return data.pairs?.[0] || null;
}
