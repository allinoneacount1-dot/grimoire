import { useEffect } from 'react';
import { useGrimoireStore } from '../store/grimoire.store';
import { generateSignals } from '../lib/signal-engine';

export function useSignalEngine() {
  const trendingTokens = useGrimoireStore((s) => s.trendingTokens);
  const setSignals = useGrimoireStore((s) => s.setSignals);
  const signalEngineStatus = useGrimoireStore((s) => s.signalEngineStatus);

  useEffect(() => {
    if (signalEngineStatus !== 'active' || trendingTokens.length === 0) return;

    const signals = generateSignals(trendingTokens);
    setSignals(signals);

    const interval = setInterval(() => {
      const newSignals = generateSignals(trendingTokens);
      setSignals(newSignals);
    }, 30000);

    return () => clearInterval(interval);
  }, [trendingTokens, signalEngineStatus, setSignals]);
}
