import { useEffect, useRef, useState } from 'react';

const paragraphs = [
  {
    glyph: '◈',
    text: 'Ancient alchemists encoded their most dangerous knowledge in grimoires — forbidden manuscripts written in cipher, readable only by those who had earned the right to see.',
  },
  {
    glyph: '◈',
    text: 'Every token launch is a ritual. Every wallet cluster is a coven. Every volume spike is an incantation beginning. Most traders see candles. GRIMOIRE reads the spell.',
  },
  {
    glyph: '◈',
    text: 'The market writes in a language of patterns — wallet accumulation behaviors, liquidity signatures, social velocity vectors, on-chain forensic tells. GRIMOIRE\'s AI engine deciphers this language in real-time.',
  },
];

export function NarrativeSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.3 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-deep py-[clamp(80px,12vh,160px)]">
      <div className="shell">
        <div className="max-w-[760px] mx-auto space-y-16">
          <blockquote className="font-display font-light text-[clamp(1.5rem,2.5vw,2.25rem)] text-parchment leading-relaxed text-center">
            "Ancient alchemists encoded forbidden knowledge in grimoires.
            GRIMOIRE is that book for on-chain markets.
            Every candle is a sentence. Every wallet cluster, a chapter.
            Most traders read headlines. You will read the manuscript."
          </blockquote>

          <div className="w-20 h-px bg-[var(--border-dim)] mx-auto" />

          <div className="space-y-8">
            {paragraphs.map((para, i) => (
              <div
                key={i}
                ref={(el) => { itemRefs.current[i] = el; }}
                data-index={i}
                className={`flex gap-4 transition-all duration-700 ${
                  visibleItems.has(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <span className="font-mono text-gold-bright text-lg shrink-0 mt-1">{para.glyph}</span>
                <p className="font-body text-base text-muted leading-[1.8]">
                  {para.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
