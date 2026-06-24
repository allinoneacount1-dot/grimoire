export interface Token {
  address: string;
  symbol: string;
  name: string;
  priceUsd: number;
  priceChange24h: number;
  priceChange1h: number;
  priceChange6h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  fdv: number;
  pairAddress: string;
  pairCreatedAt: number;
  txns24h: {
    buys: number;
    sells: number;
  };
}

export interface TokenDetail extends Token {
  description?: string;
  logoUrl?: string;
  topHolders?: Holder[];
  signals?: Signal[];
}

export interface Holder {
  address: string;
  balance: number;
  percentage: number;
  value: number;
}

export interface Signal {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  pattern: string;
  description: string;
  grade: 'S' | 'A' | 'B' | 'C';
  confidence: number;
  priceUsd: number;
  priceChange1h: number;
  volume24h: number;
  timestamp: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  currencies: string[];
  summary?: string;
}

export interface WalletData {
  address: string;
  solBalance: number;
  tokenCount: number;
  lastActivity: number;
  tokens?: TokenHolding[];
  transactions?: Transaction[];
}

export interface TokenHolding {
  symbol: string;
  balance: number;
  valueUsd: number;
  percentage: number;
}

export interface Transaction {
  signature: string;
  type: 'buy' | 'sell' | 'transfer' | 'swap';
  amount: number;
  token: string;
  timestamp: number;
}

export interface Message {
  id: string;
  role: 'user' | 'oracle';
  content: string;
  timestamp: number;
}
