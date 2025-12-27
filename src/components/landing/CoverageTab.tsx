import { forwardRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useDemo } from '@/contexts/DemoContext';
import { TranslationKey } from '@/lib/translations';
import { 
  Megaphone, Users, Truck, ShoppingCart, 
  Wallet, BarChart3, Scale, Shield,
  UserCheck, Package, HeadphonesIcon, Lock,
  CheckCircle, Brain, FileCheck, Zap, Activity
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getActiveDomains } from './DomainActivityIndicator';

// 12 Business Domains with L2 subdomains
const DOMAINS = [
  { 
    key: 'gtm', 
    icon: Megaphone,
    l2: ['Lead generation', 'Marketing campaigns', 'Brand positioning', 'Channel strategy', 'Launch playbooks', 'Partnerships'],
    l2Ru: ['Генерация лидов', 'Маркетинговые кампании', 'Позиционирование бренда', 'Стратегия каналов', 'Плейбуки запуска', 'Партнёрства'],
    runs: ['Lead capture & qualification', 'Campaign execution', 'Channel optimization'],
    runsRu: ['Захват и квалификация лидов', 'Запуск кампаний', 'Оптимизация каналов'],
    decides: 'Pricing strategy & major pivots',
    decidesRu: 'Ценовая стратегия и крупные повороты',
    proof: ['Campaign metrics', 'Lead attribution'],
    proofRu: ['Метрики кампаний', 'Атрибуция лидов'],
  },
  { 
    key: 'customer', 
    icon: Users,
    l2: ['Onboarding', 'Retention programs', 'Upsell/cross-sell', 'Churn prevention', 'NPS tracking', 'Loyalty rewards'],
    l2Ru: ['Онбординг', 'Программы удержания', 'Апсейл/кросс-сейл', 'Предотвращение оттока', 'Отслеживание NPS', 'Программы лояльности'],
    runs: ['Welcome sequences', 'Lifecycle emails', 'Renewal reminders'],
    runsRu: ['Приветственные цепочки', 'Lifecycle письма', 'Напоминания о продлении'],
    decides: 'VIP exceptions & retention offers',
    decidesRu: 'VIP исключения и офферы удержания',
    proof: ['Customer journey log', 'NPS scores'],
    proofRu: ['Лог пути клиента', 'Показатели NPS'],
  },
  { 
    key: 'delivery', 
    icon: Truck,
    l2: ['Scheduling', 'Assignment', 'Quality checks', 'Route optimization', 'SLA monitoring', 'Handoffs'],
    l2Ru: ['Планирование', 'Назначение', 'Проверки качества', 'Оптимизация маршрутов', 'Мониторинг SLA', 'Передачи'],
    runs: ['Team assignment', 'Schedule optimization', 'Quality verification'],
    runsRu: ['Назначение команды', 'Оптимизация расписания', 'Проверка качества'],
    decides: 'Service escalations & complaints',
    decidesRu: 'Эскалации и жалобы на услуги',
    proof: ['Completion photos', 'Time stamps'],
    proofRu: ['Фото завершения', 'Временные метки'],
  },
  { 
    key: 'supply', 
    icon: ShoppingCart,
    l2: ['Vendor selection', 'Purchase orders', 'Receiving', 'Quality inspection', 'Returns', 'Cost tracking'],
    l2Ru: ['Выбор поставщиков', 'Заказы на покупку', 'Приёмка', 'Проверка качества', 'Возвраты', 'Учёт затрат'],
    runs: ['PO generation', 'Reorder alerts', 'Supplier comms'],
    runsRu: ['Генерация PO', 'Алерты перезаказа', 'Связь с поставщиками'],
    decides: 'New vendors & major purchases',
    decidesRu: 'Новые вендоры и крупные закупки',
    proof: ['PO records', 'Delivery receipts'],
    proofRu: ['Записи PO', 'Накладные'],
  },
  { 
    key: 'money', 
    icon: Wallet,
    l2: ['Invoicing', 'Payment collection', 'Refunds', 'Cash flow', 'Revenue recognition', 'Reconciliation'],
    l2Ru: ['Выставление счетов', 'Сбор платежей', 'Возвраты', 'Денежный поток', 'Признание выручки', 'Сверка'],
    runs: ['Invoice generation', 'Payment reminders', 'Auto-reconciliation'],
    runsRu: ['Генерация счетов', 'Напоминания об оплате', 'Авто-сверка'],
    decides: 'Refund requests & payment plans',
    decidesRu: 'Запросы на возврат и планы оплаты',
    proof: ['Payment receipts', 'Transaction logs'],
    proofRu: ['Квитанции об оплате', 'Логи транзакций'],
  },
  { 
    key: 'accounting', 
    icon: BarChart3,
    l2: ['Bookkeeping', 'Tax prep', 'Financial reports', 'Budgeting', 'Forecasting', 'Audit prep'],
    l2Ru: ['Бухгалтерия', 'Налоговая подготовка', 'Финансовые отчёты', 'Бюджетирование', 'Прогнозирование', 'Подготовка к аудиту'],
    runs: ['Daily summaries', 'Export to accounting', 'Tax calculations'],
    runsRu: ['Ежедневные сводки', 'Экспорт в бухгалтерию', 'Расчёт налогов'],
    decides: 'Tax regime & major write-offs',
    decidesRu: 'Налоговый режим и крупные списания',
    proof: ['Financial statements', 'Tax filings'],
    proofRu: ['Финансовая отчётность', 'Налоговые декларации'],
  },
  { 
    key: 'legal', 
    icon: Scale,
    l2: ['Contracts', 'Terms of service', 'Privacy policy', 'Compliance', 'Disputes', 'IP protection'],
    l2Ru: ['Контракты', 'Условия использования', 'Политика конфиденциальности', 'Соответствие', 'Споры', 'Защита IP'],
    runs: ['Contract generation', 'Policy enforcement', 'Compliance checks'],
    runsRu: ['Генерация контрактов', 'Применение политик', 'Проверки соответствия'],
    decides: 'Policy exceptions & legal issues',
    decidesRu: 'Исключения из политик и юридические вопросы',
    proof: ['Signed contracts', 'Audit trails'],
    proofRu: ['Подписанные контракты', 'Аудит-трейлы'],
  },
  { 
    key: 'risk', 
    icon: Shield,
    l2: ['Fraud detection', 'Insurance', 'Business continuity', 'Incident response', 'Compliance monitoring', 'Internal controls'],
    l2Ru: ['Обнаружение мошенничества', 'Страхование', 'Непрерывность бизнеса', 'Реагирование на инциденты', 'Мониторинг соответствия', 'Внутренний контроль'],
    runs: ['Risk scoring', 'Alert triggers', 'Control checks'],
    runsRu: ['Оценка рисков', 'Триггеры алертов', 'Проверки контроля'],
    decides: 'Risk acceptance & mitigation plans',
    decidesRu: 'Принятие рисков и планы митигации',
    proof: ['Risk register', 'Incident logs'],
    proofRu: ['Реестр рисков', 'Логи инцидентов'],
  },
  { 
    key: 'people', 
    icon: UserCheck,
    l2: ['Hiring', 'Onboarding', 'Scheduling', 'Performance', 'Payroll', 'Offboarding'],
    l2Ru: ['Найм', 'Онбординг', 'Планирование', 'Производительность', 'Зарплата', 'Офбординг'],
    runs: ['Shift scheduling', 'Availability tracking', 'Performance metrics'],
    runsRu: ['Планирование смен', 'Отслеживание доступности', 'Метрики производительности'],
    decides: 'Hiring, firing & compensation',
    decidesRu: 'Найм, увольнение и компенсации',
    proof: ['Attendance logs', 'Performance reports'],
    proofRu: ['Логи посещаемости', 'Отчёты о работе'],
  },
  { 
    key: 'assets', 
    icon: Package,
    l2: ['Inventory', 'Equipment', 'Maintenance', 'Depreciation', 'Disposal', 'Location tracking'],
    l2Ru: ['Инвентарь', 'Оборудование', 'Обслуживание', 'Амортизация', 'Утилизация', 'Отслеживание'],
    runs: ['Inventory tracking', 'Reorder triggers', 'Maintenance schedules'],
    runsRu: ['Отслеживание инвентаря', 'Триггеры заказа', 'Графики обслуживания'],
    decides: 'Major purchases & disposals',
    decidesRu: 'Крупные закупки и списания',
    proof: ['Asset register', 'Stock levels'],
    proofRu: ['Реестр активов', 'Уровни запасов'],
  },
  { 
    key: 'support', 
    icon: HeadphonesIcon,
    l2: ['Ticket routing', 'FAQ automation', 'Escalation', 'SLA tracking', 'Feedback collection', 'Service recovery'],
    l2Ru: ['Маршрутизация тикетов', 'Автоматизация FAQ', 'Эскалация', 'Отслеживание SLA', 'Сбор отзывов', 'Восстановление сервиса'],
    runs: ['Ticket routing', 'FAQ responses', 'Escalation triggers'],
    runsRu: ['Маршрутизация тикетов', 'Ответы на FAQ', 'Триггеры эскалации'],
    decides: 'Complex complaints & compensation',
    decidesRu: 'Сложные жалобы и компенсации',
    proof: ['Resolution records', 'Customer feedback'],
    proofRu: ['Записи решений', 'Отзывы клиентов'],
  },
  { 
    key: 'data', 
    icon: Lock,
    l2: ['Access control', 'Encryption', 'Backups', 'Data retention', 'GDPR/privacy', 'Breach response'],
    l2Ru: ['Контроль доступа', 'Шифрование', 'Бэкапы', 'Хранение данных', 'GDPR/приватность', 'Реагирование на утечки'],
    runs: ['Access logging', 'Backup verification', 'Retention enforcement'],
    runsRu: ['Логирование доступа', 'Проверка бэкапов', 'Применение ретеншна'],
    decides: 'Data deletion & breach response',
    decidesRu: 'Удаление данных и реагирование на утечки',
    proof: ['Access logs', 'Deletion certificates'],
    proofRu: ['Логи доступа', 'Сертификаты удаления'],
  },
] as const;

const CoverageTab = forwardRef<HTMLDivElement>((_, ref) => {
  const { t, language } = useLanguage();
  const { state, isReplay, isDayComplete } = useDemo();
  
  // Get domains that were triggered during test day
  const triggeredDomains = getActiveDomains(state.timeline.currentEventIndex);
  const isTestDayComplete = isDayComplete || isReplay;

  return (
    <div ref={ref} className="space-y-4">
      {/* Header with live indicator */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-foreground">
            {t('coverage.title')}
          </h3>
          {isTestDayComplete && triggeredDomains.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-success/10 text-success rounded-full animate-fade-in">
              <Activity className="w-3 h-3" />
              {triggeredDomains.length} {language === 'ru' ? 'активны' : 'active'}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          {t('coverage.subtitle')}
        </p>
      </div>

      {/* Domain Accordion */}
      <Accordion type="single" collapsible className="space-y-2">
        {DOMAINS.map(({ key, icon: Icon, l2, l2Ru, runs, runsRu, decides, decidesRu, proof, proofRu }) => {
          const wasTriggered = triggeredDomains.includes(key);
          
          return (
            <AccordionItem
              key={key}
              value={key}
              className={`glass-card border-border/50 rounded-lg overflow-hidden transition-all duration-300 ${
                wasTriggered 
                  ? 'border-success/30 bg-success/5' 
                  : 'data-[state=open]:border-primary/30'
              }`}
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3 w-full">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    wasTriggered ? 'bg-success/20' : 'bg-primary/10'
                  }`}>
                    <Icon className={`w-4 h-4 ${wasTriggered ? 'text-success' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {t(`coverage.domain.${key}` as TranslationKey)}
                      </span>
                      {wasTriggered && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-success/10 text-success text-[10px] rounded-full animate-fade-in">
                          <Zap className="w-2.5 h-2.5" />
                          {language === 'ru' ? 'Активен' : 'Active'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-0.5 text-[10px] text-success">
                        <CheckCircle className="w-2.5 h-2.5" />
                        {runs.length}
                      </span>
                      <span className="flex items-center gap-0.5 text-[10px] text-accent">
                        <Brain className="w-2.5 h-2.5" />
                        1
                      </span>
                      <span className="flex items-center gap-0.5 text-[10px] text-primary">
                        <FileCheck className="w-2.5 h-2.5" />
                        {proof.length}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {/* Triggered indicator */}
                {wasTriggered && (
                  <div className="mb-4 p-2 bg-success/10 border border-success/20 rounded-lg flex items-center gap-2 animate-fade-in">
                    <Zap className="w-4 h-4 text-success" />
                    <span className="text-xs text-success">
                      {language === 'ru' 
                        ? 'Этот домен был активирован во время тестового дня' 
                        : 'This domain was triggered during the test day'
                      }
                    </span>
                  </div>
                )}
              {/* L2 Subdomains */}
              <div className="mb-4">
                <span className="text-xs text-muted-foreground mb-2 block">
                  {language === 'ru' ? 'Субдомены' : 'Subdomains'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(language === 'ru' ? l2Ru : l2).map((item, i) => (
                    <span key={i} className="px-2 py-0.5 bg-secondary text-foreground text-xs rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Runs */}
              <div className="mb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1.5">
                  <CheckCircle className="w-3 h-3 text-success" />
                  {t('coverage.runs')}
                </span>
                <ul className="space-y-1 ml-4">
                  {(language === 'ru' ? runsRu : runs).map((run, i) => (
                    <li key={i} className="text-xs text-foreground/80 list-disc">
                      {run}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CEO Decides */}
              <div className="mb-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1.5">
                  <Brain className="w-3 h-3 text-accent" />
                  {t('coverage.decides')}
                </span>
                <p className="text-xs text-accent/90 ml-4">
                  {language === 'ru' ? decidesRu : decides}
                </p>
              </div>

              {/* Proof */}
              <div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1.5">
                  <FileCheck className="w-3 h-3 text-primary" />
                  {t('coverage.proof')}
                </span>
                <div className="flex flex-wrap gap-1.5 ml-4">
                  {(language === 'ru' ? proofRu : proof).map((p, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 text-primary/90 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-4 text-xs text-muted-foreground border-t border-border/30">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-success" />
          {t('coverage.runs')}
        </span>
        <span className="flex items-center gap-1">
          <Brain className="w-3 h-3 text-accent" />
          {t('coverage.decides')}
        </span>
        <span className="flex items-center gap-1">
          <FileCheck className="w-3 h-3 text-primary" />
          {t('coverage.proof')}
        </span>
      </div>
    </div>
  );
});

CoverageTab.displayName = 'CoverageTab';

export default CoverageTab;
