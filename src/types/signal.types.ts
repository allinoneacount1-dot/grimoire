import type { DexToken } from './token.types';

export type SignalGrade = 'S' | 'A' | 'B' | 'C';

export interface Signal {
  id: string;
  grade: SignalGrade;
  token: DexToken;
  patternName: string;
  description: string;
  confidence: number;
  metrics: {
    volumeChange1h: number;
    priceChange1h: number;
    buySellRatio: number;
    liquidity: number;
    ageHours: number;
  };
  timestamp: number;
}

export interface SignalFilter {
  grades: SignalGrade[];
  minVolume: number;
  maxAge: number;
  sortBy: 'latest' | 'grade' | 'volume' | 'confidence';
}

export const GRADE_COLORS: Record<SignalGrade, { border: string; bg: string; text: string }> = {
  S: { border: 'border-gold-bright', bg: 'bg-gold-ghost', text: 'text-gold-bright' },
  A: { border: 'border-positive', bg: 'bg-positive/10', text: 'text-positive' },
  B: { border: 'border-[#4A6080]', bg: 'bg-[#4A6080]/10', text: 'text-[#4A6080]' },
  C: { border: 'border-border-dim', bg: 'bg-elevated', text: 'text-muted' },
};
