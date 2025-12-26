import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-mono text-xl font-bold tracking-wider text-foreground group-hover:text-primary transition-colors duration-300">
            {t('nav.logo')}
          </span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse group-hover:scale-125 transition-transform" />
        </Link>

        {/* Right side: Language toggle + CTA */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2 text-muted-foreground hover:text-foreground focus-ring btn-press"
          >
            <Globe className="w-4 h-4" />
            <span className="font-mono text-xs uppercase">
              {language === 'en' ? 'RU' : 'EN'}
            </span>
          </Button>

          {/* CTA */}
          <Button 
            size="sm" 
            className="btn-glow btn-press bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {t('nav.cta')}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
