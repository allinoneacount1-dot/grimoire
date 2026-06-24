import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Eye, Newspaper, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTrendingTokens, fetchNews, fetchPrices } from '../lib/api';
import { formatPrice, formatPercent, formatCompact, timeAgo } from '../lib/formatters';
import type { Token, NewsItem } from '../types';

function useCountUp(end: number, duration = 800) {
  const [value, setValue] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [end, duration]);

  return value;
}

function StatValue({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const animated = useCountUp(value);
  return (
    <span className="font-mono text-2xl font-bold text-gold-bright">
      {prefix}{formatCompact(animated)}{suffix}
    </span>
  );
}

function TrendingTable() {
  const { data: tokens } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrendingTokens,
    refetchInterval: 30000,
  });

  return (
    <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">Top Trending</span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-bright animate-pulse-gold" />
          <span className="font-mono text-xs text-rose-bright">LIVE</span>
        </div>
      </div>
      <div className="divide-y divide-border-subtle">
        {(tokens || []).slice(0, 5).map((token: Token, i: number) => (
          <div key={token.address} className="group flex items-center justify-between px-5 py-3 hover:bg-elevated transition-colors">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-tertiary w-5">{i + 1}</span>
              <div>
                <span className="font-body text-sm font-medium text-parchment">{token.symbol}</span>
                <span className="ml-2 text-xs text-muted">{token.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-mono text-sm text-parchment">${formatPrice(token.priceUsd)}</span>
              <span className={`font-mono text-xs ${token.priceChange1h >= 0 ? 'text-positive' : 'text-rose-bright'}`}>
                {formatPercent(token.priceChange1h)}
              </span>
              <span className="font-mono text-xs text-muted">${formatCompact(token.volume24h)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsFeed() {
  const { data: news } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    refetchInterval: 60000,
  });

  return (
    <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
      <div className="border-b border-border-subtle px-5 py-3">
        <span className="font-mono text-xs uppercase tracking-wider text-muted">Latest Intel</span>
      </div>
      <div className="divide-y divide-border-subtle">
        {(news || []).slice(0, 4).map((item: NewsItem) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block px-5 py-3 hover:bg-elevated transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-block rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase ${
                item.sentiment === 'bullish' ? 'bg-positive/15 text-positive' :
                item.sentiment === 'bearish' ? 'bg-rose-ghost text-rose-bright' :
                'bg-neutral/15 text-muted'
              }`}>
                {item.sentiment}
              </span>
              <span className="text-xs text-text-tertiary">{item.source}</span>
              <span className="text-xs text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">{timeAgo(item.publishedAt)}</span>
            </div>
            <p className="text-sm text-parchment/80 group-hover:text-parchment transition-colors line-clamp-2">
              {item.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

function BentoFeatures() {
  const [oracleIdx, setOracleIdx] = useState(0);
  const oracleQueries = [
    'What is the strongest signal right now?',
    'Analyze top wallet behavior on Solana today',
    'Explain the $WIF chart pattern',
    'Which tokens have unusual buy pressure?',
  ];
  const oracleResponses = [
    '◈ WHALE ACCUMULATION detected on $BONK. Buy/sell ratio at 4.2:1 with $890K volume in the last hour. Smart money wallets show consistent accumulation pattern across 3 major clusters.',
    '◈ Top 5 Solana wallets increased SOL holdings by 12% this week. Notable activity: 3 wallets withdrew from Binance and moved to self-custody. Pattern suggests pre-event positioning.',
    '◈ $WIF is forming a ascending triangle on the 4H chart with increasing volume. Key resistance at $2.85. A breakout above this level with volume confirmation could signal continuation.',
    '◈ 7 tokens showing >3:1 buy/sell ratio with >$200K volume: $BONK, $WIF, $POPCAT, $MEW, $SAMO, $FLOKI, $SHIB. Unusual pattern: coordinated buying across multiple mid-size wallets.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setOracleIdx((i) => (i + 1) % oracleQueries.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-12 gap-3">
      {/* Cell A — Pattern Detection (large) */}
      <div className="col-span-12 md:col-span-6 rounded-md border border-border-subtle bg-surface p-7 hover:bg-elevated transition-colors">
        <Zap className="h-5 w-5 text-gold-bright mb-4" />
        <h3 className="font-display text-xl font-semibold text-parchment mb-2">Pattern Detection</h3>
        <p className="font-body text-sm text-muted mb-5">The AI reads 14 behavioral pattern classes across every Solana token.</p>
        <div className="space-y-2">
          {['Whale Accumulation Surge', 'Volume Breakout', 'Smart Money Inflow', 'Momentum Ignition'].map((p, i) => (
            <div key={p} className="flex items-center gap-3 text-xs">
              <span className="font-mono text-parchment/70 w-40 truncate">{p}</span>
              <div className="flex-1 h-1.5 bg-border-subtle rounded-full overflow-hidden">
                <div className="h-full bg-gold-bright rounded-full" style={{ width: `${90 - i * 12}%` }} />
              </div>
              <span className="font-mono text-gold-dim w-10 text-right">{90 - i * 12}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cell B — Signal Engine */}
      <div className="col-span-6 md:col-span-3 rounded-md border border-border-subtle bg-surface p-7 hover:bg-elevated transition-colors">
        <Zap className="h-5 w-5 text-gold-bright mb-4" />
        <h3 className="font-display text-lg font-semibold text-parchment mb-2">Graded Signals</h3>
        <p className="font-body text-sm text-muted">Every signal rated S / A / B / C. Only S and A-grade surface by default.</p>
      </div>

      {/* Cell C — Wallet Intelligence */}
      <div className="col-span-6 md:col-span-3 rounded-md border border-border-subtle bg-surface p-7 hover:bg-elevated transition-colors">
        <Eye className="h-5 w-5 text-gold-bright mb-4" />
        <h3 className="font-display text-lg font-semibold text-parchment mb-2">Whale Forensics</h3>
        <p className="font-body text-sm text-muted">Track smart wallet accumulation before price reacts.</p>
      </div>

      {/* Cell D — Oracle AI (wide) */}
      <div className="col-span-12 md:col-span-6 rounded-md border border-border-subtle bg-surface p-7 hover:bg-elevated transition-colors">
        <h3 className="font-display text-2xl font-semibold text-parchment mb-2">Ask the Oracle</h3>
        <p className="font-body text-sm text-muted mb-5">Natural language queries about any Solana token.</p>
        <div className="rounded-md border border-border-dim bg-void p-4">
          <p className="font-mono text-xs text-gold-dim mb-2">&gt; {oracleQueries[oracleIdx]}</p>
          <p className="font-display text-sm text-parchment/80 italic leading-relaxed">
            {oracleResponses[oracleIdx]}
          </p>
        </div>
      </div>

      {/* Cell E — News Intelligence */}
      <div className="col-span-6 md:col-span-3 rounded-md border border-border-subtle bg-surface p-7 hover:bg-elevated transition-colors">
        <Newspaper className="h-5 w-5 text-gold-bright mb-4" />
        <h3 className="font-display text-lg font-semibold text-parchment mb-2">Narrative Tracking</h3>
        <p className="font-body text-sm text-muted">Live crypto news filtered for signal density.</p>
      </div>

      {/* Cell F — Real-Time Data */}
      <div className="col-span-6 md:col-span-3 rounded-md border border-border-subtle bg-surface p-7 hover:bg-elevated transition-colors">
        <span className="font-mono text-xs text-muted uppercase tracking-wider">SOL/USD</span>
        <div className="mt-2 font-mono text-3xl font-bold text-gold-bright">
          <SolPrice />
        </div>
        <span className="font-mono text-xs text-positive mt-1 inline-block">Loading...</span>
      </div>
    </div>
  );
}

function SolPrice() {
  const { data: prices } = useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    refetchInterval: 30000,
  });
  return <>{formatPrice(prices?.solana?.usd || 0)}</>;
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-void">
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-center px-6 transition-all duration-300 ${scrolled ? 'bg-void/95 backdrop-blur-sm border-b border-border-subtle' : 'bg-transparent'}`}>
        <div className="w-full max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-semibold text-gold-bright tracking-tight">GRIMOIRE</span>
          </div>
          <Link
            to="/terminal"
            className="inline-flex items-center gap-2 rounded-sm bg-gold-bright px-5 py-2 text-sm font-medium text-void hover:bg-gold-dim transition-colors"
          >
            Enter Terminal
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-[30%] -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold-bright/[0.03] blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(212,168,67,0.3) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6 inline-block rounded-sm border border-dim px-3 py-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-dim">Intelligence Terminal</span>
            </div>
            
            <h1 className="mb-6">
              <span className="block font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light text-parchment leading-[1.05] tracking-[-0.02em] animate-slide-up" style={{ animationDelay: '0ms' }}>
                The market
              </span>
              <span className="block font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light text-parchment leading-[1.05] tracking-[-0.02em] animate-slide-up" style={{ animationDelay: '100ms' }}>
                writes in
              </span>
              <span className="block font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light italic text-gold-bright leading-[1.05] tracking-[-0.02em] animate-slide-up" style={{ animationDelay: '200ms' }}>
                patterns.
              </span>
            </h1>

            <p className="mb-10 max-w-md mx-auto lg:mx-0 font-body text-lg text-muted leading-relaxed animate-fade-in" style={{ animationDelay: '300ms' }}>
              GRIMOIRE deciphers the on-chain language of markets in real-time.
              Pattern detection. Signal generation. Predictive intelligence.
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Link
                to="/terminal"
                className="inline-flex items-center gap-2 rounded-sm bg-gold-bright px-7 py-3 text-sm font-medium text-void hover:bg-gold-dim transition-all hover:-translate-y-0.5"
              >
                Enter Terminal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="text-sm text-muted hover:text-parchment transition-colors">
                How it works ↓
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center gap-2 border-r border-border-dim pr-6">
                <span className="font-mono text-xl font-bold text-gold-bright">
                  <StatValue value={142} prefix="$" suffix="B" />
                </span>
                <span className="text-xs text-muted">Market Cap</span>
              </div>
              <div className="flex items-center gap-2 border-r border-border-dim pr-6">
                <span className="font-mono text-xl font-bold text-gold-bright">
                  <StatValue value={28} prefix="$" suffix="B" />
                </span>
                <span className="text-xs text-muted">24h Volume</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-bold text-gold-bright">
                  <StatValue value={145} prefix="$" />
                </span>
                <span className="text-xs text-muted">SOL Price</span>
              </div>
            </div>
          </div>

          {/* Right column — mini chart */}
          <div className="rounded-md border border-border-dim bg-surface p-1 mx-auto w-full max-w-md">
            <div className="rounded-sm bg-void p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-muted">SOL/USD · 24h</span>
                <span className="font-mono text-xs text-positive">+2.4%</span>
              </div>
              <div className="h-[280px] flex items-end gap-[3px]">
                {Array.from({ length: 48 }, (_, i) => {
                  const h = 30 + Math.sin(i * 0.3) * 20 + Math.random() * 15;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gold-bright/30 rounded-t-sm transition-all hover:bg-gold-bright/50"
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 bg-deep">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-display text-2xl font-light text-parchment leading-relaxed mb-8">
            Ancient alchemists encoded forbidden knowledge in grimoires.
            GRIMOIRE is that book for on-chain markets.
            Every candle is a sentence. Every wallet cluster, a chapter.
            Most traders read headlines. <span className="italic text-gold-bright">You will read the manuscript.</span>
          </p>
          <div className="w-20 h-px bg-border-dim mx-auto mb-8" />
          <div className="space-y-6">
            {[
              'Every token launch is a ritual. Every wallet cluster is a coven. Every volume spike is an incantation beginning.',
              'Most traders see candles. GRIMOIRE reads the spell. The market writes in a language of patterns — wallet accumulation behaviors, liquidity signatures, social velocity vectors, on-chain forensic tells.',
              'GRIMOIRE\'s AI engine deciphers this language in real-time and surfaces actionable intelligence before consensus forms.',
            ].map((text, i) => (
              <p key={i} className="font-body text-base text-muted leading-[1.8] text-center">
                <span className="text-gold-dim mr-2">◈</span>
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Features */}
      <section id="features" className="py-32">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 font-display text-3xl font-semibold text-parchment text-center">
            What GRIMOIRE Reads
          </h2>
          <BentoFeatures />
        </div>
      </section>

      {/* Live Data Preview */}
      <section className="py-24 bg-deep border-y border-border-subtle">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-8 font-display text-2xl font-semibold text-parchment text-center">
            Live from Solana
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TrendingTable />
            <NewsFeed />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-16 font-display text-2xl font-semibold text-parchment text-center">
            The Ritual
          </h2>
          <div className="space-y-12">
            {[
              { sigil: '◈', title: 'Data Ingestion', desc: 'GRIMOIRE consumes on-chain transactions, wallet movements, liquidity events, and social velocity simultaneously.' },
              { sigil: '◉', title: 'Pattern Recognition', desc: 'The signal engine cross-references 14 behavioral pattern classes against the incoming data stream every 30 seconds.' },
              { sigil: '◎', title: 'Signal Grading', desc: 'Each pattern match is graded S through C based on historical confidence, current volume, and wallet signature quality.' },
              { sigil: '◈', title: 'Oracle Interpretation', desc: 'Query the Oracle in plain language. It synthesizes the pattern stack and returns intelligence, not noise.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 border-l-2 border-border-dim pl-6 hover:border-gold-bright transition-colors max-w-2xl mx-auto">
                <span className="text-2xl text-gold-dim">{step.sigil}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-parchment mb-2">{step.title}</h3>
                  <p className="font-body text-base text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enter CTA */}
      <section className="py-32 border-t border-border-subtle">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-5 font-display text-[clamp(1.75rem,3vw,3.5rem)] font-light text-parchment">
            The manuscript is open.
          </h2>
          <p className="mb-10 font-body text-lg text-muted">
            No account required. No KYC. Just signal.
          </p>
          <Link
            to="/terminal"
            className="inline-flex items-center gap-2 rounded-sm bg-gold-bright px-12 py-4 text-base font-medium text-void hover:bg-gold-dim transition-all hover:-translate-y-0.5 mb-8"
          >
            Enter the Terminal
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="flex items-center justify-center gap-6 text-xs text-muted">
            {['Free to use', 'No wallet required', 'Real-time data'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-gold-dim" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 border-t border-border-subtle bg-deep">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-center justify-between">
          <span className="text-xs text-muted">GRIMOIRE © 2026</span>
          <div className="flex items-center gap-6">
            {['GitHub', 'Twitter', 'Docs'].map((link) => (
              <span key={link} className="text-xs text-muted hover:text-parchment cursor-pointer transition-colors">
                {link}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
