import type { Token, NewsItem } from '../types';

const DEXSCREENER_BASE = 'https://api.dexscreener.com';
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const CRYPTOPANIC_BASE = 'https://cryptopanic.com/api/free/v1';

export async function fetchTrendingTokens(): Promise<Token[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/token-profiles/latest/v1`);
    const data = await res.json();
    
    const solanaTokens = data
      .filter((t: { chainId?: string }) => t.chainId === 'solana')
      .slice(0, 50);

    const tokenDetails = await Promise.all(
      solanaTokens.map(async (t: { tokenAddress: string }) => {
        try {
          const detailRes = await fetch(
            `${DEXSCREENER_BASE}/latest/dex/tokens/${t.tokenAddress}`
          );
          const detailData = await detailRes.json();
          const pair = detailData.pairs?.[0];
          if (!pair) return null;
          
          return {
            address: pair.baseToken.address,
            symbol: pair.baseToken.symbol,
            name: pair.baseToken.name,
            priceUsd: parseFloat(pair.priceUsd || '0'),
            priceChange24h: pair.priceChange?.h24 || 0,
            priceChange1h: pair.priceChange?.h1 || 0,
            priceChange6h: pair.priceChange?.h6 || 0,
            volume24h: pair.volume?.h24 || 0,
            liquidity: pair.liquidity?.usd || 0,
            marketCap: pair.marketCap || 0,
            fdv: pair.fdv || 0,
            pairAddress: pair.pairAddress,
            pairCreatedAt: pair.pairCreatedAt || 0,
            txns24h: {
              buys: pair.txns?.h24?.buys || 0,
              sells: pair.txns?.h24?.sells || 0,
            },
          };
        } catch {
          return null;
        }
      })
    );

    return tokenDetails.filter((t): t is Token => t !== null);
  } catch (error) {
    console.error('Failed to fetch trending tokens:', error);
    return [];
  }
}

export async function fetchTokenDetail(address: string): Promise<Token | null> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/tokens/${address}`);
    const data = await res.json();
    const pair = data.pairs?.[0];
    if (!pair) return null;

    return {
      address: pair.baseToken.address,
      symbol: pair.baseToken.symbol,
      name: pair.baseToken.name,
      priceUsd: parseFloat(pair.priceUsd || '0'),
      priceChange24h: pair.priceChange?.h24 || 0,
      priceChange1h: pair.priceChange?.h1 || 0,
      priceChange6h: pair.priceChange?.h6 || 0,
      volume24h: pair.volume?.h24 || 0,
      liquidity: pair.liquidity?.usd || 0,
      marketCap: pair.marketCap || 0,
      fdv: pair.fdv || 0,
      pairAddress: pair.pairAddress,
      pairCreatedAt: pair.pairCreatedAt || 0,
      txns24h: {
        buys: pair.txns?.h24?.buys || 0,
        sells: pair.txns?.h24?.sells || 0,
      },
    };
  } catch (error) {
    console.error('Failed to fetch token detail:', error);
    return null;
  }
}

export async function fetchPrices(): Promise<Record<string, { usd: number; change24h: number }>> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true`
    );
    const data = await res.json();
    return {
      bitcoin: { usd: data.bitcoin?.usd || 0, change24h: data.bitcoin?.usd_24h_change || 0 },
      ethereum: { usd: data.ethereum?.usd || 0, change24h: data.ethereum?.usd_24h_change || 0 },
      solana: { usd: data.solana?.usd || 0, change24h: data.solana?.usd_24h_change || 0 },
    };
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    return {};
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      `${CRYPTOPANIC_BASE}/posts/?auth_token=free&filter=hot&kind=news&currencies=SOL`
    );
    const data = await res.json();
    
    return (data.results || []).slice(0, 20).map((post: {
      id: number;
      title: string;
      source: { title: string };
      url: string;
      published_at: string;
      votes?: { positive?: number; negative?: number };
      currencies?: string[];
    }) => ({
      id: String(post.id),
      title: post.title,
      source: post.source?.title || 'Unknown',
      url: post.url,
      publishedAt: new Date(post.published_at).getTime(),
      sentiment: (post.votes?.positive || 0) > (post.votes?.negative || 0)
        ? 'bullish'
        : (post.votes?.negative || 0) > (post.votes?.positive || 0)
        ? 'bearish'
        : 'neutral',
      currencies: post.currencies || ['SOL'],
    }));
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}
