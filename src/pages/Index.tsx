import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import CoverageSummary from '@/components/landing/CoverageSummary';
import WhatBecomesReal from '@/components/landing/WhatBecomesReal';
import ProofSection from '@/components/landing/ProofSection';
import WaitlistForm from '@/components/landing/WaitlistForm';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import { DemoProvider } from '@/contexts/DemoContext';

const Index = () => {
  return (
    <DemoProvider>
      <div className="min-h-screen bg-background pattern-grid">
        <Navbar />
        <main>
          <Hero />
          <CoverageSummary />
          <WhatBecomesReal />
          <ProofSection />
          <WaitlistForm />
          <FAQ />
        </main>
        <Footer />
      </div>
    </DemoProvider>
  );
};

export default Index;
