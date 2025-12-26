import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Receipt, 
  CreditCard, 
  Users, 
  Shield, 
  Loader2,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Link2,
  Package,
  Phone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  RegionConfig, 
  IndustryConfig, 
  getReadinessLabel, 
  getReadinessColor 
} from '@/lib/regionData';
import {
  getRealityRemaining,
  canUseReality,
  incrementRealityUsage,
  getCachedReality,
  setCachedReality
} from '@/lib/storage';

interface RegionTabProps {
  prompt: string;
  region: RegionConfig | null;
  industry: IndustryConfig | null;
}

interface RegionalRules {
  summary: string;
  sources: { title: string; url: string }[];
}

interface CompetitorData {
  services: string[];
  packages: { name: string; price: string }[];
  contact: string;
  positioning: string;
}

const RegionTab = ({ prompt, region, industry }: RegionTabProps) => {
  const { language } = useLanguage();
  const [isFetching, setIsFetching] = useState(false);
  const [regionalRules, setRegionalRules] = useState<RegionalRules | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Competitor scan state
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const remaining = getRealityRemaining();
  const canFetch = canUseReality();

  const fetchRegionalRules = async () => {
    if (!canFetch || !region || isFetching) return;

    const cacheKey = `region:${region.code}:${industry?.key || 'general'}:${prompt.substring(0, 50)}`;
    const cached = getCachedReality(cacheKey, language, 'region');
    if (cached) {
      setRegionalRules(cached as RegionalRules);
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      const regionName = language === 'ru' ? region.nameRu : region.nameEn;
      const industryName = industry ? (language === 'ru' ? industry.labelRu : industry.labelEn) : 'business';

      const { data, error: fnError } = await supabase.functions.invoke('market-snapshot', {
        body: {
          businessType: industryName,
          city: regionName,
          locale: language,
          queryType: 'regional-rules',
        },
      });

      if (fnError) throw fnError;

      if (data?.success && data?.data) {
        const rules = {
          summary: data.data.bullets?.join(' ') || '',
          sources: data.data.sources || [],
        };
        setRegionalRules(rules);
        incrementRealityUsage();
        setCachedReality(cacheKey, language, 'region', rules);
      } else {
        throw new Error(data?.error || 'Failed to fetch regional rules');
      }
    } catch (err) {
      console.error('Regional rules fetch error:', err);
      setError(
        language === 'ru'
          ? 'Не удалось загрузить региональные правила'
          : 'Failed to fetch regional rules'
      );
    } finally {
      setIsFetching(false);
    }
  };

  const scanCompetitor = async () => {
    if (!competitorUrl.trim() || isScanning) return;

    setIsScanning(true);
    setScanError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('competitor-scan', {
        body: {
          url: competitorUrl,
          locale: language,
        },
      });

      if (fnError) throw fnError;

      if (data?.success && data?.data) {
        setCompetitorData(data.data);
      } else {
        throw new Error(data?.error || 'Failed to scan competitor');
      }
    } catch (err) {
      console.error('Competitor scan error:', err);
      setScanError(
        language === 'ru'
          ? 'Не удалось сканировать конкурента'
          : 'Failed to scan competitor'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const ReadinessIndicator = ({ status }: { status: 'ready' | 'planned' | 'human-bridge' }) => {
    const colorClass = getReadinessColor(status);
    const label = getReadinessLabel(status, language);
    const Icon = status === 'ready' ? CheckCircle : status === 'planned' ? Clock : AlertCircle;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  if (!region) {
    return (
      <div className="text-center py-10">
        <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          {language === 'ru' ? 'Выберите регион выше' : 'Select a region above'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Fetch Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            {language === 'ru' ? region.nameRu : region.nameEn} — {language === 'ru' ? 'Юрисдикция' : 'Jurisdiction Pack'}
          </h3>
          {industry && (
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'ru' ? 'Отрасль:' : 'Industry:'} {language === 'ru' ? industry.labelRu : industry.labelEn}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {language === 'ru' ? 'Осталось:' : 'Remaining:'} <span className="font-mono text-primary">{remaining}</span>
          </span>
          <Button
            onClick={fetchRegionalRules}
            disabled={!canFetch || isFetching}
            size="sm"
            className="gap-2"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {language === 'ru' ? 'Загрузка...' : 'Fetching...'}
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                {language === 'ru' ? 'Загрузить правила' : 'Fetch regional rules'}
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* A) Localization Block */}
      <div className="glass-card p-5">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          {language === 'ru' ? 'Локализация' : 'Localization'}
        </h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground text-xs">{language === 'ru' ? 'Валюта' : 'Currency'}</span>
            <p className="font-mono text-foreground">{region.currencySymbol} {region.currency}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">{language === 'ru' ? 'Часовой пояс' : 'Timezone'}</span>
            <p className="font-mono text-foreground text-xs">{region.timezone}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">{language === 'ru' ? 'Формат даты' : 'Date format'}</span>
            <p className="font-mono text-foreground text-xs">{region.dateFormat}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 border-t border-border/50 pt-3">
          {language === 'ru' 
            ? 'Влияет на счета, расписания, чеки, отчётность.' 
            : 'This affects invoices, schedules, receipts, reporting.'}
        </p>
      </div>

      {/* B) Tax & Invoicing Block */}
      <div className="glass-card p-5">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-accent" />
          {language === 'ru' ? 'Налоги и счета' : 'Tax & Invoicing'}
          <ReadinessIndicator status={region.invoicing} />
        </h4>
        
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-xs text-muted-foreground">{language === 'ru' ? 'Что генерирует HELM' : 'What HELM generates'}</span>
            <ul className="mt-1 space-y-1">
              <li className="text-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-success mt-0.5 shrink-0" />
                <span>{language === 'ru' ? region.taxNote.ru : region.taxNote.en}</span>
              </li>
              <li className="text-foreground flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-success mt-0.5 shrink-0" />
                <span>{region.eInvoicing 
                  ? (language === 'ru' ? 'E-invoicing поддерживается' : 'E-invoicing supported')
                  : (language === 'ru' ? 'Стандартные PDF-счета' : 'Standard PDF invoices')
                }</span>
              </li>
            </ul>
          </div>
          
          <div>
            <span className="text-xs text-accent">{language === 'ru' ? 'CEO решает' : 'CEO decides'}</span>
            <p className="text-foreground mt-1">
              {language === 'ru' ? 'Налоговый режим и исключения' : 'Tax regime selection and exceptions'}
            </p>
          </div>
          
          <div>
            <span className="text-xs text-primary">{language === 'ru' ? 'Доказательства' : 'Proof produced'}</span>
            <p className="text-foreground mt-1">
              {language === 'ru' ? 'Архив всех счетов с метками времени' : 'Archive of all invoices with timestamps'}
            </p>
          </div>
        </div>
      </div>

      {/* C) Payments Rails Block */}
      <div className="glass-card p-5">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-success" />
          {language === 'ru' ? 'Платёжные рельсы' : 'Payment Rails & Receipts'}
          <ReadinessIndicator status={region.payments} />
        </h4>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {region.paymentMethods.map((method, i) => (
            <span key={i} className="px-2 py-1 bg-success/10 text-success text-xs rounded">
              {method}
            </span>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground">
          {language === 'ru' 
            ? `Платежи ${region.payments === 'ready' ? 'готовы' : region.payments === 'planned' ? 'планируются' : 'через human-bridge'}` 
            : `Payments ${region.payments === 'ready' ? 'ready' : region.payments === 'planned' ? 'planned' : 'via human-bridge'}`}
        </p>
      </div>

      {/* D) Workforce Block */}
      <div className="glass-card p-5">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          {language === 'ru' ? 'Персонал и выплаты' : 'Workforce & Payroll'}
          <ReadinessIndicator status={region.payroll} />
        </h4>
        
        <div className="space-y-2 text-sm">
          <p className="text-foreground">
            {language === 'ru' 
              ? 'Подрядчик: счета и акты • Сотрудник: payroll-интеграция'
              : 'Contractor: invoices & agreements • Employee: payroll integration'}
          </p>
          <div>
            <span className="text-xs text-accent">{language === 'ru' ? 'CEO решает' : 'CEO decides'}</span>
            <p className="text-foreground mt-1">
              {language === 'ru' ? 'Классификация работника и связанные риски' : 'Worker classification and associated risks'}
            </p>
          </div>
        </div>
      </div>

      {/* E) Privacy / Data Residency Block */}
      <div className="glass-card p-5">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          {language === 'ru' ? 'Приватность и данные' : 'Privacy & Data Residency'}
          <ReadinessIndicator status={region.privacy} />
        </h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="text-muted-foreground text-xs">{language === 'ru' ? 'Хранение данных' : 'Data stored in'}</span>
            <p className="text-foreground">{region.dataResidency}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-xs">{language === 'ru' ? 'Срок хранения' : 'Retention'}</span>
            <p className="text-foreground">{region.retentionYears} {language === 'ru' ? 'лет' : 'years'}</p>
          </div>
        </div>
        
        <div>
          <span className="text-xs text-primary">{language === 'ru' ? 'Доказательства' : 'Proof'}</span>
          <p className="text-foreground text-sm mt-1">
            {language === 'ru' 
              ? 'Сертификат удаления / аудит-запись при запросе' 
              : 'Deletion certificate / audit record on request'}
          </p>
        </div>
      </div>

      {/* Industry Pack (if selected) */}
      {industry && (
        <div className="glass-card p-5 border-accent/30">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="text-accent">{language === 'ru' ? 'Отраслевой пакет:' : 'Industry Pack:'}</span>
            {language === 'ru' ? industry.labelRu : industry.labelEn}
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            {language === 'ru' ? industry.complianceNotes.ru : industry.complianceNotes.en}
          </p>
          <div className="flex flex-wrap gap-2">
            {(language === 'ru' ? industry.typicalOffers.ru : industry.typicalOffers.en).map((offer, i) => (
              <span key={i} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                {offer}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Regional Sources (if fetched) */}
      {regionalRules && regionalRules.sources.length > 0 && (
        <div className="glass-card p-5 border-primary/30 animate-fade-in">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-primary" />
            {language === 'ru' ? 'Источники' : 'Sources'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {regionalRules.sources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {source.title}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Scan (Optional) */}
      <div className="glass-card p-5 border-dashed border-2 border-border/50">
        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-muted-foreground" />
          {language === 'ru' ? 'Анализ конкурента (опционально)' : 'Competitor Scan (optional)'}
        </h4>
        <p className="text-xs text-muted-foreground mb-3">
          {language === 'ru' 
            ? 'Вставьте URL конкурента, чтобы извлечь услуги, цены и контакты' 
            : 'Paste a competitor URL to extract services, prices, and contact info'}
        </p>
        
        <div className="flex gap-2">
          <Input
            type="url"
            value={competitorUrl}
            onChange={(e) => setCompetitorUrl(e.target.value)}
            placeholder={language === 'ru' ? 'https://конкурент.com' : 'https://competitor.com'}
            className="flex-1 text-sm"
          />
          <Button
            onClick={scanCompetitor}
            disabled={!competitorUrl.trim() || isScanning}
            size="sm"
            variant="outline"
            className="gap-2"
          >
            {isScanning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {language === 'ru' ? 'Сканировать' : 'Scan'}
          </Button>
        </div>

        {scanError && (
          <p className="text-xs text-destructive mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {scanError}
          </p>
        )}

        {/* Competitor Results */}
        {competitorData && (
          <div className="mt-4 pt-4 border-t border-border/50 space-y-3 animate-fade-in">
            {competitorData.positioning && (
              <div>
                <span className="text-xs text-muted-foreground">{language === 'ru' ? 'Позиционирование' : 'Positioning'}</span>
                <p className="text-sm text-foreground mt-1">{competitorData.positioning}</p>
              </div>
            )}

            {competitorData.packages.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                  <Package className="w-3 h-3" />
                  {language === 'ru' ? 'Пакеты' : 'Packages'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {competitorData.packages.map((pkg, i) => (
                    <span key={i} className="px-2 py-1 bg-secondary text-foreground text-xs rounded">
                      {pkg.name} — {pkg.price}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {competitorData.services.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground">{language === 'ru' ? 'Услуги' : 'Services'}</span>
                <p className="text-sm text-foreground mt-1">{competitorData.services.join(', ')}</p>
              </div>
            )}

            {competitorData.contact && (
              <div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {language === 'ru' ? 'Контакт' : 'Contact'}
                </span>
                <p className="text-sm text-foreground mt-1">{competitorData.contact}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionTab;
