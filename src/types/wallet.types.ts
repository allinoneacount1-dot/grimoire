export interface WalletData {
  address: string;
  solBalance: number;
  tokenCount: number;
  lastActivity: number;
  tokenHoldings: TokenHolding[];
  recentTransactions: Transaction[];
}

export interface TokenHolding {
  mint: string;
  symbol: string;
  balance: number;
  usdValue: number;
  percentage: number;
}

export interface Transaction {
  signature: string;
  type: 'BUY' | 'SELL' | 'TRANSFER' | 'SWAP';
  amount: number;
  token: string;
  timestamp: number;
}
