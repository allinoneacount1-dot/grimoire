import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    sigil: '◈',
    title: 'DATA INGESTION',
    description:
      'GRIMOIRE consumes on-chain transactions, wallet movements, liquidity events, and social velocity simultaneously.',
  },
  {
    sigil: '◉',
    title: 'PATTERN RECOGNITION',
    description:
      'The signal engine cross-references 14 behavioral pattern classes against the incoming data stream every 30 seconds.',
  },
  {
    sigil: '◎',
    title: 'SIGNAL GRADING',
    description:
      'Each pattern match is graded S through C based on historical confidence, current volume, and wallet signature quality.',
  },
  {
    sigil: '◈',
    title: 'ORACLE INTERPRETATION',
    description:
      'Query the Oracle in plain language. It synthesizes the pattern stack and returns intelligence, not noise.',
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(-1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveStep(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative bg-deep py-[clamp(80px,12vh,160px)]">
      <div className="shell">
        <div className="mb-12">
          <span className="font-mono text-xs text-gold-dim tracking-[0.25em] uppercase">
            The Ritual
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              data-index={i}
              className={`border-l-2 pl-6 transition-all duration-500 ${
                activeStep >= i
                  ? 'border-gold-bright opacity-100 translate-y-0'
                  : 'border-[var(--border-dim)] opacity-50 translate-y-4'
              }`}
            >
              <span className="font-mono text-2xl text-gold-bright">{step.sigil}</span>
              <h3 className="font-mono text-sm text-parchment mt-3 mb-2 tracking-wider uppercase">
                {step.title}
              </h3>
              <p className="font-body text-sm text-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
