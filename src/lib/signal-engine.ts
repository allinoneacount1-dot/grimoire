import type { Token, Signal } from '../types';

let signalIdCounter = 0;

function generateSignalId(): string {
  signalIdCounter += 1;
  return `sig_${Date.now()}_${signalIdCounter}`;
}

function computeSignalScore(token: Token): number {
  let score = 0;

  // Volume spike
  if (token.volume24h > 100000) score += 10;
  if (token.volume24h > 500000) score += 10;

  // Price momentum
  if (token.priceChange1h > 10) score += 15;
  if (token.priceChange1h > 25) score += 10;

  // Buy pressure
  const buyRatio = token.txns24h.buys / Math.max(token.txns24h.sells, 1);
  if (buyRatio > 2) score += 25;
  if (buyRatio > 1.5) score += 10;

  // Liquidity check
  if (token.liquidity > 50000) score += 10;
  if (token.liquidity > 200000) score += 5;

  // New token bonus (< 24h)
  const ageHours = (Date.now() - token.pairCreatedAt) / (1000 * 60 * 60);
  if (ageHours < 24) score += 15;
  if (ageHours < 6) score += 10;

  // Overextended penalty
  if (token.priceChange24h > 100) score -= 15;
  if (token.priceChange24h > 200) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function scoreToGrade(score: number): 'S' | 'A' | 'B' | 'C' {
  if (score >= 80) return 'S';
  if (score >= 60) return 'A';
  if (score >= 40) return 'B';
  return 'C';
}

function getPatternName(token: Token, score: number): string {
  const buyRatio = token.txns24h.buys / Math.max(token.txns24h.sells, 1);
  const ageHours = (Date.now() - token.pairCreatedAt) / (1000 * 60 * 60);

  if (buyRatio > 3 && score >= 80) return 'Whale Accumulation Surge';
  if (token.priceChange1h > 25 && token.volume24h > 500000) return 'Volume Breakout';
  if (ageHours < 6 && buyRatio > 2) return 'New Launch Frenzy';
  if (token.priceChange1h > 10 && token.priceChange6h < 5) return 'Momentum Ignition';
  if (token.liquidity > 200000 && buyRatio > 1.5) return 'Smart Money Inflow';
  if (token.priceChange24h > 50 && token.priceChange1h > 10) return 'Continuation Pattern';
  if (buyRatio > 2 && token.volume24h > 100000) return 'Buy Wall Formation';
  return 'Early Signal Detection';
}

function getPatternDescription(token: Token, pattern: string): string {
  const buyRatio = token.txns24h.buys / Math.max(token.txns24h.sells, 1);
  return `${pattern} detected on ${token.symbol}. ` +
    `Buy/sell ratio: ${buyRatio.toFixed(1)}:1. ` +
    `Volume: $${(token.volume24h / 1000).toFixed(0)}K in 24h. ` +
    `Liquidity: $${(token.liquidity / 1000).toFixed(0)}K.`;
}

export function generateSignals(tokens: Token[]): Signal[] {
  return tokens
    .map((token) => {
      const score = computeSignalScore(token);
      const grade = scoreToGrade(score);
      const pattern = getPatternName(token, score);

      return {
        id: generateSignalId(),
        tokenAddress: token.address,
        tokenSymbol: token.symbol,
        tokenName: token.name,
        pattern,
        description: getPatternDescription(token, pattern),
        grade,
        confidence: score,
        priceUsd: token.priceUsd,
        priceChange1h: token.priceChange1h,
        volume24h: token.volume24h,
        timestamp: Date.now(),
      };
    })
    .sort((a, b) => b.confidence - a.confidence);
}
