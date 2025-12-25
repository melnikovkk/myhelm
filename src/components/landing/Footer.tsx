import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Tagline */}
          <div className="text-center md:text-left">
            <span className="font-mono text-lg font-bold tracking-wider text-foreground">
              {t('nav.logo')}
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
