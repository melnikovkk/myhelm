import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Rocket, Sparkles, Pencil, CheckCircle2, Globe, Briefcase, ChevronDown } from 'lucide-react';
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
  
  // New: Region and Industry selectors
  const [selectedRegion, setSelectedRegion] = useState<RegionConfig | null>(REGIONS.find(r => r.code === 'DE') || null);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryConfig | null>(INDUSTRIES.find(i => i.key === 'service') || null);
  const [demoMode, setDemoMode] = useState<'zero' | 'digitize'>('zero');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

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
    // Note: BusinessSimulator handles transition to ARTIFACTS after AI generation completes
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

  const handlePromptGenerated = (generatedPrompt: string, data?: MarketSnapshot) => {
    setPrompt(generatedPrompt);
    setShowWizard(false);
    setState('TYPED');
    if (data) {
      setMarketData(data);
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
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'ru' ? 'AI-Powered Business Autopilot' : 'AI-Powered Business Autopilot'}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            <span className="text-gradient">{t('hero.headline')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subheadline')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Region & Industry Selectors - Always visible */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            {/* Region Selector */}
            <div className="relative">
              <button
                onClick={() => { setShowRegionDropdown(!showRegionDropdown); setShowIndustryDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors text-sm"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-foreground">{selectedRegion ? (language === 'ru' ? selectedRegion.nameRu : selectedRegion.nameEn) : (language === 'ru' ? 'Выбрать регион' : 'Select region')}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showRegionDropdown && (
                <div className="absolute z-50 top-full left-0 mt-1 w-56 max-h-64 overflow-y-auto bg-card border border-border rounded-lg shadow-xl animate-fade-in">
                  {REGIONS.map((region) => (
                    <button
                      key={region.code}
                      onClick={() => { setSelectedRegion(region); setShowRegionDropdown(false); }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 transition-colors flex items-center justify-between ${selectedRegion?.code === region.code ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                    >
                      <span>{language === 'ru' ? region.nameRu : region.nameEn}</span>
                      <span className="text-xs text-muted-foreground">{region.currency}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Industry Selector */}
            <div className="relative">
              <button
                onClick={() => { setShowIndustryDropdown(!showIndustryDropdown); setShowRegionDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors text-sm"
              >
                <Briefcase className="w-4 h-4 text-accent" />
                <span className="text-foreground">{selectedIndustry ? (language === 'ru' ? selectedIndustry.labelRu : selectedIndustry.labelEn) : (language === 'ru' ? 'Выбрать отрасль' : 'Select industry')}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showIndustryDropdown && (
                <div className="absolute z-50 top-full left-0 mt-1 w-56 bg-card border border-border rounded-lg shadow-xl animate-fade-in">
                  {INDUSTRIES.map((industry) => (
                    <button
                      key={industry.key}
                      onClick={() => { setSelectedIndustry(industry); setShowIndustryDropdown(false); }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 transition-colors ${selectedIndustry?.key === industry.key ? 'bg-accent/10 text-accent' : 'text-foreground'}`}
                    >
                      {language === 'ru' ? industry.labelRu : industry.labelEn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 md:p-8 rounded-2xl">
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
                      className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 resize-none text-base rounded-xl"
                      disabled={state === 'LAUNCHING'}
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="relative p-4 bg-gradient-to-br from-secondary/80 to-secondary/40 rounded-xl border border-border/50 group hover:border-primary/30 transition-colors">
                      <p className="text-base text-foreground leading-relaxed pr-8">
                        {prompt}
                      </p>
                      {state !== 'LAUNCHING' && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title={language === 'ru' ? 'Редактировать' : 'Edit'}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Market data indicator */}
                    {marketData && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-accent">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'ru' ? 'Данные рынка загружены' : 'Market data loaded'}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <button 
                        onClick={handleStartOver}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {language === 'ru' ? 'Другой промпт' : 'Different prompt'}
                      </button>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${prompt.length >= 10 ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'}`}>
                        {prompt.length >= 10 ? '✓' : prompt.length}/10+
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleLaunch}
                  disabled={!isLaunchEnabled || state === 'LAUNCHING'}
                  size="lg"
                  className={`w-full gap-3 text-lg font-semibold transition-all duration-300 rounded-xl ${
                    isLaunchEnabled && state !== 'LAUNCHING' 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {state === 'LAUNCHING' ? (
                    <><div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />{t('hero.launching')}</>
                  ) : (
                    <><Rocket className="w-5 h-5" />{t('hero.launch')}</>
                  )}
                </Button>

                {isEditing && (
                  <div className="mt-3 flex justify-end">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${prompt.length >= 10 ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted'}`}>
                      {prompt.length}/10+
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {showSimulator && (
            <BusinessSimulator 
              state={state} 
              setState={setState} 
              prompt={prompt} 
              onEditPrompt={handleEditPrompt}
              region={selectedRegion}
              industry={selectedIndustry}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
