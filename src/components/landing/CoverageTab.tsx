import { useLanguage } from '@/hooks/useLanguage';
import { TranslationKey } from '@/lib/translations';
import { 
  ShoppingCart, 
  Truck, 
  Wallet, 
  HeadphonesIcon, 
  Users, 
  Scale, 
  BarChart3, 
  Package,
  CheckCircle,
  Brain,
  FileCheck
} from 'lucide-react';

// 8 Business Domains
const DOMAINS = [
  { key: 'sell', icon: ShoppingCart },
  { key: 'deliver', icon: Truck },
  { key: 'money', icon: Wallet },
  { key: 'support', icon: HeadphonesIcon },
  { key: 'people', icon: Users },
  { key: 'legal', icon: Scale },
  { key: 'reporting', icon: BarChart3 },
  { key: 'assets', icon: Package },
] as const;

// Domain details - what runs, what CEO decides, what proof
const DOMAIN_DETAILS: Record<string, { runs: string[]; decides: string; proof: string[] }> = {
  sell: {
    runs: ['Lead capture & qualification', 'Booking confirmation', 'Follow-up sequences'],
    decides: 'Pricing exceptions & discounts >10%',
    proof: ['Booking record', 'Customer communication log'],
  },
  deliver: {
    runs: ['Team assignment', 'Schedule optimization', 'Quality verification'],
    decides: 'Service escalations & complaints',
    proof: ['Completion photos', 'Time stamps'],
  },
  money: {
    runs: ['Invoice generation', 'Payment collection', 'Reconciliation'],
    decides: 'Refund requests & payment plans',
    proof: ['Payment receipts', 'Transaction logs'],
  },
  support: {
    runs: ['Ticket routing', 'FAQ responses', 'Escalation triggers'],
    decides: 'Complex complaints & compensation',
    proof: ['Resolution records', 'Customer feedback'],
  },
  people: {
    runs: ['Shift scheduling', 'Availability tracking', 'Performance metrics'],
    decides: 'Hiring, firing & raises',
    proof: ['Attendance logs', 'Performance reports'],
  },
  legal: {
    runs: ['Contract generation', 'Policy enforcement', 'Compliance checks'],
    decides: 'Policy exceptions & legal issues',
    proof: ['Signed contracts', 'Audit trails'],
  },
  reporting: {
    runs: ['Daily summaries', 'Weekly reports', 'Trend analysis'],
    decides: 'Strategic pivots & investments',
    proof: ['Revenue reports', 'KPI dashboards'],
  },
  assets: {
    runs: ['Inventory tracking', 'Reorder triggers', 'Supplier management'],
    decides: 'Major purchases & vendor changes',
    proof: ['Purchase orders', 'Stock levels'],
  },
};

// Russian translations for domain details
const DOMAIN_DETAILS_RU: Record<string, { runs: string[]; decides: string; proof: string[] }> = {
  sell: {
    runs: ['Захват и квалификация лидов', 'Подтверждение бронирования', 'Цепочки follow-up'],
    decides: 'Ценовые исключения и скидки >10%',
    proof: ['Запись бронирования', 'Лог коммуникации'],
  },
  deliver: {
    runs: ['Назначение команды', 'Оптимизация расписания', 'Проверка качества'],
    decides: 'Эскалации и жалобы на услуги',
    proof: ['Фото завершения', 'Временные метки'],
  },
  money: {
    runs: ['Генерация счетов', 'Сбор платежей', 'Сверка'],
    decides: 'Возвраты и платёжные планы',
    proof: ['Квитанции об оплате', 'Логи транзакций'],
  },
  support: {
    runs: ['Маршрутизация тикетов', 'Ответы на FAQ', 'Триггеры эскалации'],
    decides: 'Сложные жалобы и компенсации',
    proof: ['Записи решений', 'Отзывы клиентов'],
  },
  people: {
    runs: ['Планирование смен', 'Отслеживание доступности', 'Метрики производительности'],
    decides: 'Найм, увольнение и повышения',
    proof: ['Логи посещаемости', 'Отчёты о работе'],
  },
  legal: {
    runs: ['Генерация контрактов', 'Применение политик', 'Проверки соответствия'],
    decides: 'Исключения из политик и юридические вопросы',
    proof: ['Подписанные контракты', 'Аудит-трейлы'],
  },
  reporting: {
    runs: ['Ежедневные сводки', 'Еженедельные отчёты', 'Анализ трендов'],
    decides: 'Стратегические повороты и инвестиции',
    proof: ['Отчёты о выручке', 'KPI дашборды'],
  },
  assets: {
    runs: ['Отслеживание инвентаря', 'Триггеры заказа', 'Управление поставщиками'],
    decides: 'Крупные закупки и смена вендоров',
    proof: ['Заказы на покупку', 'Уровни запасов'],
  },
};

const CoverageTab = () => {
  const { t, language } = useLanguage();
  const details = language === 'ru' ? DOMAIN_DETAILS_RU : DOMAIN_DETAILS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {t('coverage.title')}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {t('coverage.subtitle')}
        </p>
      </div>

      {/* Domain Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DOMAINS.map(({ key, icon: Icon }) => {
          const detail = details[key];
          
          return (
            <div 
              key={key}
              className="glass-card p-4 hover:border-primary/30 transition-colors group"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">
                  {t(`coverage.domain.${key}` as TranslationKey)}
                </h4>
              </div>

              {/* Runs */}
              <div className="mb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <CheckCircle className="w-3 h-3 text-success" />
                  {t('coverage.runs')}
                </span>
                <ul className="space-y-1">
                  {detail.runs.map((run, i) => (
                    <li key={i} className="text-xs text-foreground/80">
                      {run}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CEO Decides */}
              <div className="mb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Brain className="w-3 h-3 text-accent" />
                  {t('coverage.decides')}
                </span>
                <p className="text-xs text-accent/80">
                  {detail.decides}
                </p>
              </div>

              {/* Proof */}
              <div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <FileCheck className="w-3 h-3 text-primary" />
                  {t('coverage.proof')}
                </span>
                <div className="flex flex-wrap gap-1">
                  {detail.proof.map((p, i) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary/80 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoverageTab;
