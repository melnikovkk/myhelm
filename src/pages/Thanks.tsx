import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const Thanks = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pattern-grid flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-fade-in-up">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center glow-border" style={{ boxShadow: '0 0 40px hsl(142 71% 45% / 0.3)' }}>
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {t('thanks.title')}
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-muted-foreground mb-8">
          {t('thanks.subtitle')}
        </p>

        {/* Back button */}
        <Button asChild variant="outline" className="gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            {t('thanks.back')}
          </Link>
        </Button>

        {/* HELM Logo */}
        <div className="mt-16">
          <span className="font-mono text-sm text-muted-foreground tracking-widest">
            {t('nav.logo')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Thanks;
