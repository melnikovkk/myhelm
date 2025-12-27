import { forwardRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();

  return (
    <footer ref={ref} className="border-t border-border bg-background">
      <div className="container mx-auto px-6 lg:px-8 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo + Tagline */}
          <div className="text-center md:text-left">
            <span className="font-semibold text-foreground">
              {t('nav.logo')}
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
