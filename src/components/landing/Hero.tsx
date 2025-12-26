import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Sparkles, Pencil, CheckCircle2, Globe, Briefcase, ChevronDown, ArrowRight, Play } from 'lucide-react';
import BusinessSimulator, { SimulatorState } from './BusinessSimulator';
import PromptGenerator from './PromptGenerator';
import heroBg from '@/assets/hero-bg.jpg';
import { REGIONS, INDUSTRIES, RegionConfig, IndustryConfig } from '@/lib/regionData';

interface MarketSnapshot {
  bullets: string[];
  sources: { title: string; url: string }[];
}

export interface DemoContext {
  region: RegionConfig | null;
  industry: IndustryConfig | null;
  mode: 'zero' | 'digitize';
}

const Hero = () => {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<SimulatorState>('EMPTY');
  const [showWizard, setShowWizard] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [marketData, setMarketData] = useState<MarketSnapshot | null>(null);
  
  // Region and Industry selectors
  const [selectedRegion, setSelectedRegion] = useState<RegionConfig | null>(REGIONS.find(r => r.code === 'DE') || null);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryConfig | null>(INDUSTRIES.find(i => i.key === 'service') || null);
  const [demoMode, setDemoMode] = useState<'zero' | 'digitize'>('zero');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowRegionDropdown(false);
      setShowIndustryDropdown(false);
    };
    if (showRegionDropdown || showIndustryDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showRegionDropdown, showIndustryDropdown]);

  const isLaunchEnabled = prompt.length >= 10;

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    if (value.length >= 10 && state === 'EMPTY') {
      setState('TYPED');
    } else if (value.length < 10 && state === 'TYPED') {
      setState('EMPTY');
    }
  };

  const handleLaunch = () => {
    if (!isLaunchEnabled || state === 'LAUNCHING') return;
    setIsEditing(false);
    setState('LAUNCHING');
  };

  const handleEditPrompt = () => {
    setState('TYPED');
    setIsEditing(true);
  };

  const getCanonPrompt = () => {
    return language === 'ru' ? t('canon.prompt.ru') : t('canon.prompt.en');
  };

  const handleUseCanon = () => {
    setPrompt(getCanonPrompt());
    setShowWizard(false);
    setState('TYPED');
    setMarketData(null);
  };

  const handlePromptGenerated = (generatedPrompt: string, data?: MarketSnapshot, mode?: 'zero' | 'digitize') => {
    setPrompt(generatedPrompt);
    setShowWizard(false);
    setState('TYPED');
    if (data) {
      setMarketData(data);
    }
    if (mode) {
      setDemoMode(mode);
    }
  };

  const handleStartOver = () => {
    setPrompt('');
    setState('EMPTY');
    setShowWizard(true);
    setIsEditing(false);
    setMarketData(null);
  };

  const showSimulator = ['ARTIFACTS', 'RUNNING', 'DECISION', 'DECIDED', 'EVIDENCE', 'REPLAY'].includes(state);

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden min-h-[90vh] flex items-center">
      {/* Hero background with overlay */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Animated background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/8 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 opacity-0 animate-fade-in backdrop-blur-sm" style={{ animationFillMode: 'forwards' }}>
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ru' ? 'AI-Powered Business Autopilot' : 'AI-Powered Business Autopilot'}</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-[1.1] opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <span className="text-gradient">{t('hero.headline')}</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-up leading-relaxed" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            {t('hero.subheadline')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Region & Industry Selectors - Only show before demo starts */}
          {!showSimulator && (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6 opacity-0 animate-fade-in relative z-[60]" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              {/* Region Selector */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => { setShowRegionDropdown(!showRegionDropdown); setShowIndustryDropdown(false); }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/40 hover:bg-card transition-all duration-300 text-sm group focus-ring"
                >
                  <Globe className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-foreground font-medium">{selectedRegion ? (language === 'ru' ? selectedRegion.nameRu : selectedRegion.nameEn) : (language === 'ru' ? 'Выбрать регион' : 'Select region')}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showRegionDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showRegionDropdown && (
                  <div className="absolute z-[70] top-full left-0 mt-2 w-64 max-h-72 overflow-y-auto bg-card border border-border rounded-xl shadow-2xl animate-scale-in">
                    <div className="p-2">
                      {REGIONS.map((region) => (
                        <button
                          key={region.code}
                          onClick={() => { setSelectedRegion(region); setShowRegionDropdown(false); }}
                          className={`w-full px-3 py-2.5 text-left text-sm rounded-lg transition-all duration-200 flex items-center justify-between ${selectedRegion?.code === region.code ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-secondary/50'}`}
                        >
                          <span className="font-medium">{language === 'ru' ? region.nameRu : region.nameEn}</span>
                          <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">{region.currency}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Industry Selector */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => { setShowIndustryDropdown(!showIndustryDropdown); setShowRegionDropdown(false); }}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-accent/40 hover:bg-card transition-all duration-300 text-sm group focus-ring"
                >
                  <Briefcase className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                  <span className="text-foreground font-medium">{selectedIndustry ? (language === 'ru' ? selectedIndustry.labelRu : selectedIndustry.labelEn) : (language === 'ru' ? 'Выбрать отрасль' : 'Select industry')}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showIndustryDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showIndustryDropdown && (
                  <div className="absolute z-[70] top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl animate-scale-in">
                    <div className="p-2">
                      {INDUSTRIES.map((industry) => (
                        <button
                          key={industry.key}
                          onClick={() => { setSelectedIndustry(industry); setShowIndustryDropdown(false); }}
                          className={`w-full px-3 py-2.5 text-left text-sm rounded-lg transition-all duration-200 ${selectedIndustry?.key === industry.key ? 'bg-accent/15 text-accent' : 'text-foreground hover:bg-secondary/50'}`}
                        >
                          <span className="font-medium">{language === 'ru' ? industry.labelRu : industry.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Demo Card */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border-primary/10 shadow-2xl opacity-0 animate-scale-in relative overflow-hidden" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            {/* Subtle glow effect */}
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              {/* Wizard Mode: Show prompt generator */}
              {showWizard && !prompt && (
                <PromptGenerator 
                  onPromptGenerated={handlePromptGenerated}
                  onUseCanon={handleUseCanon}
                  region={selectedRegion}
                  industry={selectedIndustry}
                />
              )}

              {/* Prompt Ready: Show prompt with launch button */}
              {(!showWizard || prompt) && (
                <>
                  {isEditing ? (
                    <div className="mb-6">
                      <Textarea
                        value={prompt}
                        onChange={(e) => handlePromptChange(e.target.value)}
                        placeholder={t('hero.prompt.placeholder')}
                        className="min-h-[140px] bg-background/60 border-border/50 focus:border-primary/50 resize-none text-base rounded-xl"
                        disabled={state === 'LAUNCHING'}
                      />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="relative p-5 bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl border border-border/50 group hover:border-primary/30 transition-all duration-300">
                        <p className="text-base text-foreground leading-relaxed pr-10">
                          {prompt}
                        </p>
                        {state !== 'LAUNCHING' && (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-4 right-4 p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-lg transition-all opacity-60 group-hover:opacity-100"
                            title={language === 'ru' ? 'Редактировать' : 'Edit'}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Market data indicator */}
                      {marketData && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-accent bg-accent/10 px-3 py-2 rounded-lg">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-medium">{language === 'ru' ? 'Данные рынка загружены' : 'Market data loaded'}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <button 
                          onClick={handleStartOver}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-primary/5"
                        >
                          <Sparkles className="w-4 h-4" />
                          {language === 'ru' ? 'Другой промпт' : 'Different prompt'}
                        </button>
                        <span className={`text-xs font-mono px-3 py-1 rounded-lg ${prompt.length >= 10 ? 'text-success bg-success/10 border border-success/20' : 'text-muted-foreground bg-muted'}`}>
                          {prompt.length >= 10 ? '✓ Ready' : `${prompt.length}/10`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Launch Button */}
                  <Button
                    onClick={handleLaunch}
                    disabled={!isLaunchEnabled || state === 'LAUNCHING'}
                    size="lg"
                    className={`w-full gap-3 text-lg font-semibold transition-all duration-300 rounded-xl h-14 ${
                      isLaunchEnabled && state !== 'LAUNCHING' 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02]' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {state === 'LAUNCHING' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t('hero.launching')}
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        {t('hero.launch')}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>

                  {isEditing && (
                    <div className="mt-4 flex justify-end">
                      <span className={`text-xs font-mono px-3 py-1 rounded-lg ${prompt.length >= 10 ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'}`}>
                        {prompt.length}/10+
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Simulator */}
          {showSimulator && (
            <BusinessSimulator 
              state={state} 
              setState={setState} 
              prompt={prompt} 
              onEditPrompt={handleEditPrompt}
              region={selectedRegion}
              industry={selectedIndustry}
              mode={demoMode}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
