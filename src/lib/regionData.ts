// Region and Industry data for HELM global demo
// Readiness model: 'ready' | 'planned' | 'human-bridge'

export type ReadinessStatus = 'ready' | 'planned' | 'human-bridge';

export interface RegionConfig {
  code: string;
  nameEn: string;
  nameRu: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: string;
  // Readiness per capability
  payments: ReadinessStatus;
  invoicing: ReadinessStatus;
  payroll: ReadinessStatus;
  privacy: ReadinessStatus;
  // Region-specific info
  taxNote: { en: string; ru: string };
  eInvoicing: boolean;
  paymentMethods: string[];
  dataResidency: string;
  retentionYears: number;
}

export interface IndustryConfig {
  key: string;
  labelEn: string;
  labelRu: string;
  icon: string;
  // Industry-specific overlays
  complianceNotes: { en: string; ru: string };
  typicalOffers: { en: string[]; ru: string[] };
}

// 10 Pilot Countries
export const REGIONS: RegionConfig[] = [
  {
    code: 'US',
    nameEn: 'United States',
    nameRu: 'США',
    currency: 'USD',
    currencySymbol: '$',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    payments: 'ready',
    invoicing: 'ready',
    payroll: 'planned',
    privacy: 'ready',
    taxNote: {
      en: 'Sales tax varies by state. HELM generates compliant invoices.',
      ru: 'Налог с продаж зависит от штата. HELM генерирует соответствующие счета.',
    },
    eInvoicing: false,
    paymentMethods: ['Stripe', 'ACH', 'Credit Card'],
    dataResidency: 'US',
    retentionYears: 7,
  },
  {
    code: 'DE',
    nameEn: 'Germany',
    nameRu: 'Германия',
    currency: 'EUR',
    currencySymbol: '€',
    timezone: 'Europe/Berlin',
    dateFormat: 'DD.MM.YYYY',
    payments: 'ready',
    invoicing: 'ready',
    payroll: 'planned',
    privacy: 'ready',
    taxNote: {
      en: '19% VAT standard. Kleinunternehmer exempt below €22k. HELM handles both.',
      ru: 'НДС 19% стандарт. Малый бизнес освобождён до €22k. HELM учитывает оба варианта.',
    },
    eInvoicing: true,
    paymentMethods: ['SEPA', 'Stripe', 'PayPal'],
    dataResidency: 'EU',
    retentionYears: 10,
  },
  {
    code: 'GB',
    nameEn: 'United Kingdom',
    nameRu: 'Великобритания',
    currency: 'GBP',
    currencySymbol: '£',
    timezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
    payments: 'ready',
    invoicing: 'ready',
    payroll: 'planned',
    privacy: 'ready',
    taxNote: {
      en: '20% VAT above £85k threshold. HELM tracks threshold automatically.',
      ru: 'НДС 20% при обороте выше £85k. HELM отслеживает порог автоматически.',
    },
    eInvoicing: false,
    paymentMethods: ['Stripe', 'BACS', 'Open Banking'],
    dataResidency: 'UK',
    retentionYears: 6,
  },
  {
    code: 'FR',
    nameEn: 'France',
    nameRu: 'Франция',
    currency: 'EUR',
    currencySymbol: '€',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    payments: 'ready',
    invoicing: 'ready',
    payroll: 'human-bridge',
    privacy: 'ready',
    taxNote: {
      en: '20% TVA standard. Auto-entrepreneur regime available. HELM configures based on status.',
      ru: 'НДС 20% стандарт. Режим auto-entrepreneur доступен. HELM настраивает по статусу.',
    },
    eInvoicing: true,
    paymentMethods: ['SEPA', 'Stripe', 'Carte Bancaire'],
    dataResidency: 'EU',
    retentionYears: 10,
  },
  {
    code: 'BR',
    nameEn: 'Brazil',
    nameRu: 'Бразилия',
    currency: 'BRL',
    currencySymbol: 'R$',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    payments: 'planned',
    invoicing: 'planned',
    payroll: 'human-bridge',
    privacy: 'planned',
    taxNote: {
      en: 'Nota Fiscal required. Simples Nacional for small business. HELM integration planned.',
      ru: 'Требуется Nota Fiscal. Simples Nacional для малого бизнеса. Интеграция HELM запланирована.',
    },
    eInvoicing: true,
    paymentMethods: ['PIX', 'Boleto', 'Credit Card'],
    dataResidency: 'Brazil',
    retentionYears: 5,
  },
  {
    code: 'IN',
    nameEn: 'India',
    nameRu: 'Индия',
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    payments: 'planned',
    invoicing: 'planned',
    payroll: 'human-bridge',
    privacy: 'planned',
    taxNote: {
      en: 'GST required above ₹20L. E-invoicing mandatory for large turnover. HELM integration planned.',
      ru: 'GST обязателен выше ₹20L. E-invoicing обязателен для крупного оборота. Интеграция HELM запланирована.',
    },
    eInvoicing: true,
    paymentMethods: ['UPI', 'Razorpay', 'Net Banking'],
    dataResidency: 'India',
    retentionYears: 8,
  },
  {
    code: 'AU',
    nameEn: 'Australia',
    nameRu: 'Австралия',
    currency: 'AUD',
    currencySymbol: 'A$',
    timezone: 'Australia/Sydney',
    dateFormat: 'DD/MM/YYYY',
    payments: 'ready',
    invoicing: 'ready',
    payroll: 'planned',
    privacy: 'ready',
    taxNote: {
      en: '10% GST above $75k. ABN required. HELM generates tax invoices.',
      ru: 'GST 10% выше $75k. ABN обязателен. HELM генерирует налоговые счета.',
    },
    eInvoicing: true,
    paymentMethods: ['Stripe', 'PayID', 'BPAY'],
    dataResidency: 'Australia',
    retentionYears: 5,
  },
  {
    code: 'CA',
    nameEn: 'Canada',
    nameRu: 'Канада',
    currency: 'CAD',
    currencySymbol: 'C$',
    timezone: 'America/Toronto',
    dateFormat: 'YYYY-MM-DD',
    payments: 'ready',
    invoicing: 'ready',
    payroll: 'planned',
    privacy: 'ready',
    taxNote: {
      en: 'GST/HST varies by province. HELM calculates automatically.',
      ru: 'GST/HST зависит от провинции. HELM рассчитывает автоматически.',
    },
    eInvoicing: false,
    paymentMethods: ['Stripe', 'Interac', 'Credit Card'],
    dataResidency: 'Canada',
    retentionYears: 6,
  },
  {
    code: 'RU',
    nameEn: 'Russia',
    nameRu: 'Россия',
    currency: 'RUB',
    currencySymbol: '₽',
    timezone: 'Europe/Moscow',
    dateFormat: 'DD.MM.YYYY',
    payments: 'human-bridge',
    invoicing: 'planned',
    payroll: 'human-bridge',
    privacy: 'planned',
    taxNote: {
      en: 'USN/Patent system for small business. HELM tracks via human-bridge until local integration.',
      ru: 'УСН/Патент для малого бизнеса. HELM работает через human-bridge до локальной интеграции.',
    },
    eInvoicing: false,
    paymentMethods: ['YooMoney', 'Sberbank', 'Tinkoff'],
    dataResidency: 'Russia',
    retentionYears: 5,
  },
  {
    code: 'AE',
    nameEn: 'UAE',
    nameRu: 'ОАЭ',
    currency: 'AED',
    currencySymbol: 'د.إ',
    timezone: 'Asia/Dubai',
    dateFormat: 'DD/MM/YYYY',
    payments: 'planned',
    invoicing: 'ready',
    payroll: 'human-bridge',
    privacy: 'ready',
    taxNote: {
      en: '5% VAT since 2018. Free zone benefits available. HELM configures per zone.',
      ru: 'НДС 5% с 2018. Преимущества свободных зон. HELM настраивает по зоне.',
    },
    eInvoicing: false,
    paymentMethods: ['Stripe', 'PayTabs', 'Bank Transfer'],
    dataResidency: 'UAE',
    retentionYears: 5,
  },
];

// 8 Industries
export const INDUSTRIES: IndustryConfig[] = [
  {
    key: 'service',
    labelEn: 'Service',
    labelRu: 'Услуги',
    icon: 'Wrench',
    complianceNotes: {
      en: 'Service contracts, booking confirmations, completion records required.',
      ru: 'Требуются договоры услуг, подтверждения бронирования, акты выполнения.',
    },
    typicalOffers: {
      en: ['Hourly rate', 'Package deal', 'Subscription'],
      ru: ['Почасовая ставка', 'Пакет услуг', 'Подписка'],
    },
  },
  {
    key: 'ecommerce',
    labelEn: 'E-commerce',
    labelRu: 'E-commerce',
    icon: 'ShoppingCart',
    complianceNotes: {
      en: 'Return policy, shipping terms, consumer rights disclosures required.',
      ru: 'Требуются политика возврата, условия доставки, раскрытие прав потребителей.',
    },
    typicalOffers: {
      en: ['Products', 'Bundles', 'Subscriptions'],
      ru: ['Товары', 'Наборы', 'Подписки'],
    },
  },
  {
    key: 'retail',
    labelEn: 'Retail',
    labelRu: 'Розница',
    icon: 'Store',
    complianceNotes: {
      en: 'POS receipts, inventory tracking, consumer protection compliance.',
      ru: 'Кассовые чеки, учёт запасов, соответствие защите потребителей.',
    },
    typicalOffers: {
      en: ['In-store', 'Click & Collect', 'Local delivery'],
      ru: ['В магазине', 'Заказ и самовывоз', 'Локальная доставка'],
    },
  },
  {
    key: 'healthcare',
    labelEn: 'Healthcare',
    labelRu: 'Здравоохранение',
    icon: 'Heart',
    complianceNotes: {
      en: 'HIPAA/GDPR health data rules, consent forms, medical records retention.',
      ru: 'Правила HIPAA/GDPR для медданных, формы согласия, хранение медкарт.',
    },
    typicalOffers: {
      en: ['Consultation', 'Treatment plan', 'Membership'],
      ru: ['Консультация', 'План лечения', 'Членство'],
    },
  },
  {
    key: 'manufacturing',
    labelEn: 'Manufacturing',
    labelRu: 'Производство',
    icon: 'Factory',
    complianceNotes: {
      en: 'Quality certifications, supply chain documentation, safety compliance.',
      ru: 'Сертификаты качества, документация цепочки поставок, соответствие безопасности.',
    },
    typicalOffers: {
      en: ['Bulk orders', 'Custom production', 'OEM contracts'],
      ru: ['Оптовые заказы', 'Заказное производство', 'OEM контракты'],
    },
  },
  {
    key: 'digital',
    labelEn: 'Digital Products',
    labelRu: 'Цифровые продукты',
    icon: 'Download',
    complianceNotes: {
      en: 'Digital delivery confirmation, license terms, no-refund disclosures.',
      ru: 'Подтверждение цифровой доставки, условия лицензии, политика без возврата.',
    },
    typicalOffers: {
      en: ['One-time', 'Subscription', 'Lifetime'],
      ru: ['Разовая покупка', 'Подписка', 'Пожизненный доступ'],
    },
  },
  {
    key: 'logistics',
    labelEn: 'Logistics',
    labelRu: 'Логистика',
    icon: 'Truck',
    complianceNotes: {
      en: 'Shipping documentation, customs declarations, delivery confirmations.',
      ru: 'Документация доставки, таможенные декларации, подтверждения получения.',
    },
    typicalOffers: {
      en: ['Per delivery', 'Route contract', 'Fleet management'],
      ru: ['За доставку', 'Контракт на маршрут', 'Управление парком'],
    },
  },
  {
    key: 'other',
    labelEn: 'Other',
    labelRu: 'Другое',
    icon: 'HelpCircle',
    complianceNotes: {
      en: 'General business compliance. HELM adapts to your specific requirements.',
      ru: 'Общее соответствие бизнеса. HELM адаптируется к вашим требованиям.',
    },
    typicalOffers: {
      en: ['Custom', 'Project-based', 'Retainer'],
      ru: ['Индивидуально', 'Проектная работа', 'Абонентское обслуживание'],
    },
  },
];

// Helper to get region by code
export function getRegion(code: string): RegionConfig | undefined {
  return REGIONS.find(r => r.code === code);
}

// Helper to get industry by key
export function getIndustry(key: string): IndustryConfig | undefined {
  return INDUSTRIES.find(i => i.key === key);
}

// Format currency amount for a region
export function formatCurrency(amount: number, regionCode: string): string {
  const region = getRegion(regionCode);
  if (!region) return `$${amount}`;
  return `${region.currencySymbol}${amount.toLocaleString()}`;
}

// Get readiness label
export function getReadinessLabel(status: ReadinessStatus, language: 'en' | 'ru'): string {
  const labels = {
    ready: { en: 'Ready', ru: 'Готово' },
    planned: { en: 'Planned', ru: 'Планируется' },
    'human-bridge': { en: 'Human-bridge', ru: 'Human-bridge' },
  };
  return labels[status][language];
}

// Get readiness color class
export function getReadinessColor(status: ReadinessStatus): string {
  switch (status) {
    case 'ready':
      return 'text-success bg-success/10';
    case 'planned':
      return 'text-accent bg-accent/10';
    case 'human-bridge':
      return 'text-muted-foreground bg-muted';
  }
}
