import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

export function EnterCTA() {
  return (
    <section className="relative h-[60vh] flex items-center">
      <div className="shell text-center">
        <div className="space-y-8">
          <h2 className="font-display font-light text-[clamp(2rem,3.5vw,3.5rem)] text-parchment">
            The manuscript is open.
          </h2>

          <p className="font-body text-lg text-muted">
            No account required. No KYC. Just signal.
          </p>

          <div className="pt-4">
            <Link
              to="/terminal"
              className="inline-flex items-center gap-2 px-12 py-4 bg-gold-bright text-void font-medium text-base hover:bg-gold-dim transition-all duration-200 hover:-translate-y-px no-underline"
              style={{ borderRadius: '2px' }}
            >
              Enter the Terminal
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8">
            {['Free to use', 'No wallet required', 'Real-time data'].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold-bright" />
                <span className="font-body text-xs text-muted">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
