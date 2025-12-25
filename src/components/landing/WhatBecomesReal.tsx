import { useLanguage } from '@/hooks/useLanguage';
import { FileText, Settings, Rocket } from 'lucide-react';
import mobileDashboard from '@/assets/mobile-dashboard.png';

const WhatBecomesReal = () => {
  const { t, language } = useLanguage();

  const artifacts = [
    {
      icon: FileText,
      titleKey: 'artifact.blueprint.title' as const,
      descKey: 'real.blueprint.desc' as const,
    },
    {
      icon: Settings,
      titleKey: 'artifact.os.title' as const,
      descKey: 'real.os.desc' as const,
    },
    {
      icon: Rocket,
      titleKey: 'artifact.launch.title' as const,
      descKey: 'real.proof.desc' as const,
    },
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Left: Image */}
          <div className="relative">
            <img 
              src={mobileDashboard} 
              alt="HELM Mobile Dashboard" 
              className="w-full max-w-md mx-auto drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          </div>
          
          {/* Right: Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('real.title')}
            </h2>
            <div className="w-20 h-1 bg-primary mb-6 rounded-full" />
            <p className="text-muted-foreground mb-8">
              {language === 'ru' 
                ? 'Из промпта — в работающий бизнес. Не шаблон. Не документ. Реальная система, которая работает.'
                : 'From prompt to running business. Not a template. Not a document. A real system that works.'}
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {artifacts.map(({ icon: Icon, titleKey, descKey }, i) => (
            <div 
              key={i}
              className="glass-card p-6 text-center group hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t(titleKey)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatBecomesReal;
