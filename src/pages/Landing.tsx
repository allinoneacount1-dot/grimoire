import { Nav } from '../components/landing/Nav';
import { Hero } from '../components/landing/Hero';
import { NarrativeSection } from '../components/landing/NarrativeSection';
import { BentoFeatures } from '../components/landing/BentoFeatures';
import { LivePreview } from '../components/landing/LivePreview';
import { HowItWorks } from '../components/landing/HowItWorks';
import { EnterCTA } from '../components/landing/EnterCTA';
import { Footer } from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <Hero />
      <NarrativeSection />
      <BentoFeatures />
      <LivePreview />
      <HowItWorks />
      <EnterCTA />
      <Footer />
    </div>
  );
}
