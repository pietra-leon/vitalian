import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { HowItWorks } from './components/HowItWorks';
import { SecuritySection } from './components/SecuritySection';
import { ClinicSection } from './components/ClinicSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <SecuritySection />
        <ClinicSection />
      </main>
      <Footer />
    </div>
  );
}
