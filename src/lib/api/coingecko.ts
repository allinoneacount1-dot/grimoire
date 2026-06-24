import type { CoinGeckoGlobal, CoinGeckoMarket } from '../../types/token.types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function getGlobalMarketData(): Promise<CoinGeckoGlobal> {
  const response = await fetch(`${BASE_URL}/global`);
  if (!response.ok) throw new Error('Failed to fetch global data');
  return response.json();
}

export async function getMarketData(ids: string[] = ['solana', 'bitcoin', 'ethereum']): Promise<CoinGeckoMarket[]> {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}&order=market_cap_desc&sparkline=false`
  );
  if (!response.ok) throw new Error('Failed to fetch market data');
  return response.json();
}

export async function getSolanaPrice(): Promise<{ usd: number; usd_24h_change: number }> {
  const response = await fetch(`${BASE_URL}/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true`);
  if (!response.ok) throw new Error('Failed to fetch SOL price');
  const data = await response.json();
  return data.solana;
}

export async function getSolanaMarketChart(days: number = 7): Promise<{ prices: [number, number][] }> {
  const response = await fetch(`${BASE_URL}/coins/solana/market_chart?vs_currency=usd&days=${days}`);
  if (!response.ok) throw new Error('Failed to fetch SOL chart');
  return response.json();
}
