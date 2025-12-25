import { useLanguage } from '@/hooks/useLanguage';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pattern-grid">
      <Navbar />
      <main>
        <Hero />
        {/* More sections will be added in subsequent phases */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
