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

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  const toggleTheme = () => {
    document.documentElement.classList.add('transitioning');
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => {
      document.documentElement.classList.remove('transitioning');
    }, 200);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
            <span className="font-semibold text-background text-sm">H</span>
          </div>
          <span className="font-semibold text-foreground">
            {t('nav.logo')}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-8 h-8 text-muted-foreground hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-1.5 text-muted-foreground hover:text-foreground text-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === 'en' ? 'RU' : 'EN'}
          </Button>

          <Button 
            size="sm" 
            className="ml-2 h-8 text-xs font-medium"
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