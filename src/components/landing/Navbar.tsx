import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Globe, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  const toggleTheme = () => {
    // Add transitioning class for smooth animation
    document.documentElement.classList.add('transitioning');
    setTheme(theme === 'dark' ? 'light' : 'dark');
    // Remove transitioning class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('transitioning');
    }, 300);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30 transition-colors duration-300">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="font-display font-bold text-primary-foreground text-sm">H</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            {t('nav.logo')}
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-300"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                <Sun className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  theme === 'dark' ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`} />
                <Moon className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`} />
              </div>
            </Button>
          )}

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">
              {language === 'en' ? 'RU' : 'EN'}
            </span>
          </Button>

          {/* CTA */}
          <Button 
            size="sm" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl px-5 shadow-sm hover:shadow-glow transition-all ml-1"
            onClick={() => {
              document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('nav.cta')}
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
