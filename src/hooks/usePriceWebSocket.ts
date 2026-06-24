import { useEffect, useRef } from 'react';
import { useGrimoireStore } from '../store/grimoire.store';

export function usePriceWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const setPrices = useGrimoireStore((s) => s.setPrices);

  useEffect(() => {
    const connect = () => {
      try {
        wsRef.current = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,solana');
        
        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const prices: Record<string, { usd: number; change24h: number }> = {};
          
          Object.entries(data).forEach(([asset, priceData]: [string, unknown]) => {
            const pd = priceData as { price: string };
            prices[asset] = {
              usd: parseFloat(pd.price),
              change24h: 0,
            };
          });
          
          setPrices(prices);
        };

        wsRef.current.onclose = () => {
          setTimeout(connect, 5000);
        };
      } catch {
        setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [setPrices]);
}
