import type { DexToken } from '../types/token.types';
import type { Signal, SignalGrade } from '../types/signal.types';

export function calculateSignalScore(token: DexToken): number {
  let score = 0;
  
  const volumeChange1h = token.txns?.h1?.buys && token.txns?.h1?.sells
    ? ((token.txns.h1.buys + token.txns.h1.sells) / Math.max(token.txns.h24.buys + token.txns.h24.sells, 1)) * 100
    : 0;
  
  if (volumeChange1h > 50) score += 20;
  
  const priceChange1h = token.priceChange?.h1 || 0;
  if (priceChange1h > 10 && token.volume?.h1 > 0) score += 15;
  
  const buys = token.txns?.h1?.buys || 0;
  const sells = token.txns?.h1?.sells || 0;
  if (buys > sells && sells > 0 && buys / sells > 2) score += 25;
  else if (buys > sells && sells === 0) score += 20;
  
  if (token.liquidity?.usd > 50000) score += 10;
  
  const ageHours = token.pairCreatedAt
    ? (Date.now() - token.pairCreatedAt) / (1000 * 60 * 60)
    : 999;
  if (ageHours < 24) score += 15;
  
  if (token.priceChange?.h24 > 50) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

export function scoreToGrade(score: number): SignalGrade {
  if (score >= 80) return 'S';
  if (score >= 60) return 'A';
  if (score >= 40) return 'B';
  return 'C';
}

export function generateSignals(tokens: DexToken[]): Signal[] {
  return tokens
    .map(token => {
      const score = calculateSignalScore(token);
      const grade = scoreToGrade(score);
      const ageHours = token.pairCreatedAt
        ? (Date.now() - token.pairCreatedAt) / (1000 * 60 * 60)
        : 999;
      
      return {
        id: `${token.pairAddress}-${Date.now()}`,
        grade,
        token,
        patternName: detectPattern(token),
        description: generateDescription(token, grade),
        confidence: score,
        metrics: {
          volumeChange1h: token.volume?.h1 || 0,
          priceChange1h: token.priceChange?.h1 || 0,
          buySellRatio: token.txns?.h1?.sells > 0
            ? (token.txns.h1.buys / token.txns.h1.sells)
            : token.txns?.h1?.buys || 0,
          liquidity: token.liquidity?.usd || 0,
          ageHours,
        },
        timestamp: Date.now(),
      };
    })
    .sort((a, b) => b.confidence - a.confidence);
}

function detectPattern(token: DexToken): string {
  const buys = token.txns?.h1?.buys || 0;
  const sells = token.txns?.h1?.sells || 0;
  const volumeChange = token.volume?.h1 || 0;
  const priceChange = token.priceChange?.h1 || 0;
  
  if (buys > sells * 3 && volumeChange > 10000) return 'Whale Accumulation';
  if (priceChange > 20 && volumeChange > 5000) return 'Momentum Breakout';
  if (token.pairCreatedAt && (Date.now() - token.pairCreatedAt) < 3600000) return 'New Listing Surge';
  if (buys > sells * 2 && priceChange > 5) return 'Stealth Accumulation';
  if (volumeChange > 50000) return 'Volume Anomaly';
  return 'Pattern Detected';
}

function generateDescription(token: DexToken, grade: SignalGrade): string {
  const buys = token.txns?.h1?.buys || 0;
  const sells = token.txns?.h1?.sells || 0;
  const ratio = sells > 0 ? (buys / sells).toFixed(1) : '∞';
  
  if (grade === 'S') return `Strong buy pressure detected. ${ratio}:1 buy/sell ratio with significant volume.`;
  if (grade === 'A') return `Active accumulation pattern. Volume increasing with favorable buy/sell dynamics.`;
  if (grade === 'B') return `Moderate signal detected. Monitor for confirmation before entry.`;
  return `Weak signal. Insufficient data for high-confidence assessment.`;
}
