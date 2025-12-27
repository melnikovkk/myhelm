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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-sm">H</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            {t('nav.logo')}
          </span>
        </Link>

        {/* Right side: Language toggle + CTA */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === 'en' ? 'RU' : 'EN'}
            </span>
          </Button>

          {/* CTA */}
          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl px-5 shadow-sm hover:shadow-glow transition-all"
          >
            {t('nav.cta')}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
