import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useMarketData } from '../../hooks/useMarketData';
import { formatPrice, formatLargeNumber, formatPercent } from '../../lib/formatters';
import { createChart, ColorType, LineSeries } from 'lightweight-charts';

export function Hero() {
  const { marketData } = useMarketData();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#16111E' },
        textColor: '#8A7F76',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 320,
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color: '#D4A843',
      lineWidth: 2,
    });

    const data = Array.from({ length: 96 }, (_, i) => {
      const time = Math.floor(Date.now() / 1000) - (96 - i) * 900;
      const base = 140 + Math.sin(i * 0.15) * 8 + (Math.random() - 0.5) * 5;
      return { time: time as import('lightweight-charts').Time, value: base };
    });

    lineSeries.setData(data);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  const sol = marketData?.find((m) => m.id === 'solana');

  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 65% 40%, rgba(212,168,67,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="shell relative z-10 w-full py-[clamp(80px,12vh,160px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div
              className="inline-flex items-center px-3 py-1 border border-[var(--border-dim)] text-xs font-mono text-gold-dim tracking-[0.25em] uppercase animate-fade-in"
              style={{ borderRadius: '2px' }}
            >
              Intelligence Terminal
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-light text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[1.05] text-parchment animate-slide-up">
                The market
              </h1>
              <h1 className="font-display font-light text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[1.05] text-parchment animate-slide-up" style={{ animationDelay: '0.1s' }}>
                writes in
              </h1>
              <h1 className="font-display font-light italic text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[1.05] text-gold-bright animate-slide-up" style={{ animationDelay: '0.2s' }}>
                patterns.
              </h1>
            </div>

            <p className="font-body text-lg text-muted max-w-[420px] leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
              GRIMOIRE deciphers the on-chain language of markets in real-time.
              Pattern detection. Signal generation. Predictive intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <Link
                to="/terminal"
                className="flex items-center gap-2 px-6 py-3 bg-gold-bright text-void font-medium text-sm hover:bg-gold-dim transition-all duration-150 hover:-translate-y-px no-underline"
                style={{ borderRadius: '2px' }}
              >
                Enter Terminal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="text-sm text-muted hover:text-gold-bright transition-colors duration-150 no-underline"
              >
                How it works ↓
              </a>
            </div>

            {sol && (
              <div className="flex items-center gap-6 pt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-muted text-sm font-body">SOL</span>
                  <span className="font-mono text-sm text-parchment tabular-nums">
                    {formatPrice(sol.current_price)}
                  </span>
                </div>
                <div className="w-px h-4 bg-[var(--border-dim)]" />
                <div className="flex items-center gap-2">
                  <span className="text-muted text-sm font-body">MCap</span>
                  <span className="font-mono text-sm text-parchment tabular-nums">
                    {formatLargeNumber(sol.market_cap)}
                  </span>
                </div>
                <div className="w-px h-4 bg-[var(--border-dim)]" />
                <div className="flex items-center gap-2">
                  <span className="text-muted text-sm font-body">24h</span>
                  <span
                    className={`font-mono text-sm tabular-nums ${
                      sol.price_change_percentage_24h >= 0 ? 'text-positive' : 'text-rose-bright'
                    }`}
                  >
                    {formatPercent(sol.price_change_percentage_24h)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div
              ref={chartContainerRef}
              className="border border-[var(--border-dim)] bg-surface"
              style={{ borderRadius: '4px' }}
            />
            <div
              className="p-4 border border-[var(--border-subtle)] bg-surface"
              style={{ borderRadius: '4px' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-gold-bright animate-pulse-gold" />
                <span className="font-mono text-xs text-gold-dim uppercase tracking-wider">
                  Latest Signal
                </span>
              </div>
              <p className="font-display text-lg text-parchment">Whale Accumulation</p>
              <p className="font-body text-sm text-muted mt-1">
                Strong buy pressure detected with favorable ratio
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-muted" />
        </div>
      </div>
    </section>
  );
}
