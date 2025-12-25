// All UI strings for HELM landing page
// Usage: t('key') returns string in current language

export type Language = 'en' | 'ru';

export const translations = {
  // Navbar
  'nav.cta': {
    en: 'Join Waitlist',
    ru: 'В список ожидания',
  },
  'nav.logo': {
    en: 'HELM',
    ru: 'HELM',
  },

  // Hero Section
  'hero.headline': {
    en: 'From idea to running business.',
    ru: 'От идеи до работающего бизнеса.',
  },
  'hero.subheadline': {
    en: 'Describe what you want to build. HELM launches it — with proof.',
    ru: 'Опиши, что хочешь построить. HELM запустит — с доказательствами.',
  },
  'hero.prompt.placeholder': {
    en: 'Describe your business idea in a few sentences...',
    ru: 'Опиши свою бизнес-идею в нескольких предложениях...',
  },
  'hero.launch': {
    en: 'Launch Business',
    ru: 'Запустить бизнес',
  },
  'hero.launching': {
    en: 'Compiling your business...',
    ru: 'Компилируем твой бизнес...',
  },

  // Tabs
  'tab.business': {
    en: 'Business',
    ru: 'Бизнес',
  },
  'tab.reality': {
    en: 'Reality',
    ru: 'Реальность',
  },
  'tab.coverage': {
    en: 'Coverage',
    ru: 'Покрытие',
  },

  // Artifact A: Business Blueprint
  'artifact.blueprint.title': {
    en: 'Business Blueprint',
    ru: 'Бизнес-план',
  },
  'artifact.blueprint.name': {
    en: 'Name',
    ru: 'Название',
  },
  'artifact.blueprint.offer': {
    en: 'Offer',
    ru: 'Предложение',
  },
  'artifact.blueprint.target': {
    en: 'Target',
    ru: 'Целевая аудитория',
  },
  'artifact.blueprint.channel': {
    en: 'Channel',
    ru: 'Канал',
  },
  'artifact.blueprint.week1': {
    en: 'Week 1 Plan',
    ru: 'План на 1 неделю',
  },

  // Artifact B: Operating System
  'artifact.os.title': {
    en: 'Operating System',
    ru: 'Операционная система',
  },
  'artifact.os.roles': {
    en: 'Roles',
    ru: 'Роли',
  },
  'artifact.os.loops': {
    en: 'Core Loops',
    ru: 'Основные циклы',
  },
  'artifact.os.loop.sell': {
    en: 'Sell',
    ru: 'Продажа',
  },
  'artifact.os.loop.deliver': {
    en: 'Deliver',
    ru: 'Доставка',
  },
  'artifact.os.loop.money': {
    en: 'Money',
    ru: 'Деньги',
  },
  'artifact.os.loop.support': {
    en: 'Support',
    ru: 'Поддержка',
  },
  'artifact.os.policies': {
    en: 'Policies',
    ru: 'Политики',
  },

  // Artifact C: Launch & Proof
  'artifact.launch.title': {
    en: 'Launch & Proof',
    ru: 'Запуск и доказательства',
  },
  'artifact.launch.readiness': {
    en: 'Readiness',
    ru: 'Готовность',
  },
  'artifact.launch.inbox.ready': {
    en: 'Inbox ready',
    ru: 'Входящие готовы',
  },
  'artifact.launch.calendar.ready': {
    en: 'Calendar synced',
    ru: 'Календарь синхронизирован',
  },
  'artifact.launch.payments.ready': {
    en: 'Payments ready',
    ru: 'Платежи готовы',
  },
  'artifact.launch.testday': {
    en: 'Test Day',
    ru: 'Тестовый день',
  },
  'artifact.launch.evidence': {
    en: 'Evidence',
    ru: 'Доказательства',
  },

  // Timeline
  'timeline.title': {
    en: 'Test Day Timeline',
    ru: 'Хроника тестового дня',
  },
  'timeline.run': {
    en: 'Run a test day',
    ru: 'Запустить тестовый день',
  },
  'timeline.running': {
    en: 'Running test day...',
    ru: 'Запускаем тестовый день...',
  },
  'timeline.09:00': {
    en: 'Lead received',
    ru: 'Лид получен',
  },
  'timeline.10:00': {
    en: 'Booking confirmed',
    ru: 'Бронь подтверждена',
  },
  'timeline.12:00': {
    en: 'Cleaner assigned',
    ru: 'Назначен исполнитель',
  },
  'timeline.14:00': {
    en: 'Service completed',
    ru: 'Услуга выполнена',
  },
  'timeline.15:00': {
    en: 'Invoice sent',
    ru: 'Счёт отправлен',
  },
  'timeline.15:30': {
    en: 'CEO Decision',
    ru: 'Решение CEO',
  },
  'timeline.16:00': {
    en: 'Decision recorded',
    ru: 'Решение записано',
  },
  'timeline.17:00': {
    en: 'Payment received',
    ru: 'Оплата получена',
  },

  // Boss Decision Modal
  'decision.title': {
    en: 'CEO Decision Required',
    ru: 'Требуется решение CEO',
  },
  'decision.customer': {
    en: 'Customer Klaus requests €49 refund.',
    ru: 'Клиент Klaus просит возврат €49.',
  },
  'decision.reason': {
    en: 'Reason: "Missed a spot."',
    ru: 'Причина: «Пропустили угол.»',
  },
  'decision.cleaner': {
    en: 'Cleaner confirms completed.',
    ru: 'Уборщик подтвердил выполнение.',
  },
  'decision.question': {
    en: 'Approve refund?',
    ru: 'Одобрить возврат?',
  },
  'decision.approve': {
    en: 'Approve',
    ru: 'Одобрить',
  },
  'decision.deny': {
    en: 'Deny',
    ru: 'Отклонить',
  },
  'decision.photo': {
    en: 'Request photo proof',
    ru: 'Запросить фото',
  },
  'decision.footer': {
    en: '⚡ Decision will be recorded with proof',
    ru: '⚡ Решение будет записано с доказательством',
  },

  // Evidence Trophies
  'evidence.booking': {
    en: '📸 Booking confirmed',
    ru: '📸 Бронь подтверждена',
  },
  'evidence.verified': {
    en: '✅ Service verified',
    ru: '✅ Услуга проверена',
  },
  'evidence.payment': {
    en: '💶 Payment receipt',
    ru: '💶 Чек об оплате',
  },

  // Replay Mode
  'replay.edit': {
    en: 'Edit prompt',
    ru: 'Изменить запрос',
  },
  'replay.scrubber': {
    en: 'Drag to replay',
    ru: 'Перетащи для повтора',
  },

  // Reality Tab
  'reality.title': {
    en: 'Reality Check',
    ru: 'Проверка реальности',
  },
  'reality.fetch': {
    en: 'Fetch reality (public web)',
    ru: 'Загрузить реальность (публичные данные)',
  },
  'reality.fetching': {
    en: 'Fetching reality...',
    ru: 'Загружаем реальность...',
  },
  'reality.note': {
    en: 'Uses public web sources. May take ~5–10s.',
    ru: 'Использует публичные источники. Займёт ~5–10 сек.',
  },
  'reality.limit': {
    en: 'Reality checks remaining',
    ru: 'Осталось проверок реальности',
  },
  'reality.market.title': {
    en: 'Market Snapshot',
    ru: 'Обзор рынка',
  },
  'reality.market.sources': {
    en: 'Sources',
    ru: 'Источники',
  },
  'reality.competitor.title': {
    en: 'Competitor Scan',
    ru: 'Анализ конкурента',
  },
  'reality.competitor.placeholder': {
    en: 'Paste competitor URL (optional)',
    ru: 'Вставь URL конкурента (опционально)',
  },
  'reality.competitor.skip': {
    en: 'Skip competitor scan',
    ru: 'Пропустить анализ конкурента',
  },
  'reality.competitor.scan': {
    en: 'Scan competitor',
    ru: 'Сканировать конкурента',
  },
  'reality.voice.title': {
    en: 'CEO Voice Briefing',
    ru: 'Голосовой брифинг CEO',
  },
  'reality.voice.toggle': {
    en: 'Enable voice briefing',
    ru: 'Включить голосовой брифинг',
  },
  'reality.voice.generating': {
    en: 'Generating briefing...',
    ru: 'Генерируем брифинг...',
  },

  // Coverage Map
  'coverage.title': {
    en: 'Full Business Coverage',
    ru: 'Полное покрытие бизнеса',
  },
  'coverage.subtitle': {
    en: 'HELM runs your entire business, not just one piece.',
    ru: 'HELM ведёт весь бизнес, а не только одну часть.',
  },
  'coverage.runs': {
    en: 'Runs',
    ru: 'Выполняет',
  },
  'coverage.decides': {
    en: 'CEO decides',
    ru: 'CEO решает',
  },
  'coverage.proof': {
    en: 'Proof',
    ru: 'Доказательства',
  },
  // 8 Domains
  'coverage.domain.sell': {
    en: 'Sell',
    ru: 'Продажа',
  },
  'coverage.domain.deliver': {
    en: 'Deliver',
    ru: 'Доставка',
  },
  'coverage.domain.money': {
    en: 'Money',
    ru: 'Деньги',
  },
  'coverage.domain.support': {
    en: 'Support',
    ru: 'Поддержка',
  },
  'coverage.domain.people': {
    en: 'People',
    ru: 'Люди',
  },
  'coverage.domain.legal': {
    en: 'Legal & Policies',
    ru: 'Право и политики',
  },
  'coverage.domain.reporting': {
    en: 'Reporting',
    ru: 'Отчётность',
  },
  'coverage.domain.assets': {
    en: 'Assets & Supplies',
    ru: 'Активы и закупки',
  },

  // What becomes real section
  'real.title': {
    en: 'What becomes real',
    ru: 'Что становится реальным',
  },
  'real.blueprint.desc': {
    en: 'Your business model, offers, and target — structured and ready.',
    ru: 'Твоя бизнес-модель, предложения и аудитория — структурированы и готовы.',
  },
  'real.os.desc': {
    en: 'Roles, loops, and policies — your business runs itself.',
    ru: 'Роли, циклы и политики — бизнес работает сам.',
  },
  'real.proof.desc': {
    en: 'Every action recorded. Every decision with evidence.',
    ru: 'Каждое действие записано. Каждое решение — с доказательством.',
  },

  // Proof Section
  'proof.title': {
    en: 'The Evidence Vault',
    ru: 'Хранилище доказательств',
  },
  'proof.subtitle': {
    en: 'Every decision, every action — recorded with proof.',
    ru: 'Каждое решение, каждое действие — записано с доказательством.',
  },

  // Waitlist Form
  'waitlist.title': {
    en: 'Be first to build with HELM',
    ru: 'Стань первым, кто построит с HELM',
  },
  'waitlist.email.placeholder': {
    en: 'Your email',
    ru: 'Твой email',
  },
  'waitlist.prompt.placeholder': {
    en: 'What will you build? (optional)',
    ru: 'Что будешь строить? (опционально)',
  },
  'waitlist.submit': {
    en: 'Join Waitlist',
    ru: 'Присоединиться',
  },
  'waitlist.submitting': {
    en: 'Joining...',
    ru: 'Присоединяемся...',
  },
  'waitlist.success': {
    en: 'You\'re on the list!',
    ru: 'Ты в списке!',
  },
  'waitlist.mode.new': {
    en: 'Start new business',
    ru: 'Новый бизнес',
  },
  'waitlist.mode.digitize': {
    en: 'Digitize existing',
    ru: 'Оцифровать существующий',
  },
  'waitlist.demo.banner': {
    en: 'Demo mode: Connect backend to collect signups',
    ru: 'Демо-режим: Подключи бэкенд для сбора заявок',
  },

  // FAQ
  'faq.title': {
    en: 'Questions',
    ru: 'Вопросы',
  },
  'faq.q1': {
    en: 'What can I build with HELM?',
    ru: 'Что можно построить с HELM?',
  },
  'faq.a1': {
    en: 'Any service business: cleaning, consulting, coaching, agencies, local services. If it involves selling, delivering, and getting paid — HELM runs it.',
    ru: 'Любой сервисный бизнес: клининг, консалтинг, коучинг, агентства, локальные услуги. Если есть продажа, доставка и оплата — HELM справится.',
  },
  'faq.q2': {
    en: 'Do I need technical skills?',
    ru: 'Нужны ли технические навыки?',
  },
  'faq.a2': {
    en: 'No. You describe what you want in plain words. HELM builds and runs it.',
    ru: 'Нет. Ты описываешь, что хочешь, обычными словами. HELM строит и запускает.',
  },
  'faq.q3': {
    en: 'How is this different?',
    ru: 'Чем это отличается?',
  },
  'faq.a3': {
    en: 'Other tools help you organize tasks. HELM runs your business end-to-end: from lead to payment, with proof of every decision.',
    ru: 'Другие инструменты помогают организовать задачи. HELM ведёт бизнес от и до: от лида до оплаты, с доказательством каждого решения.',
  },
  'faq.q4': {
    en: 'When does it launch?',
    ru: 'Когда запуск?',
  },
  'faq.a4': {
    en: 'Early 2025. Join the waitlist to be first.',
    ru: 'Начало 2025. Вступай в список ожидания, чтобы быть первым.',
  },

  // Footer
  'footer.tagline': {
    en: 'The operating system for your business.',
    ru: 'Операционная система для твоего бизнеса.',
  },
  'footer.copyright': {
    en: '© 2025 HELM. All rights reserved.',
    ru: '© 2025 HELM. Все права защищены.',
  },

  // Thanks Page
  'thanks.title': {
    en: 'You\'re on the list!',
    ru: 'Ты в списке!',
  },
  'thanks.subtitle': {
    en: 'We\'ll notify you when HELM is ready for launch.',
    ru: 'Мы сообщим, когда HELM будет готов к запуску.',
  },
  'thanks.back': {
    en: 'Back to home',
    ru: 'На главную',
  },

  // Errors
  'error.email.required': {
    en: 'Email is required',
    ru: 'Email обязателен',
  },
  'error.email.invalid': {
    en: 'Invalid email format',
    ru: 'Неверный формат email',
  },
  'error.prompt.short': {
    en: 'Describe your idea in at least 10 characters',
    ru: 'Опиши идею минимум в 10 символах',
  },
  'error.generic': {
    en: 'Something went wrong. Please try again.',
    ru: 'Что-то пошло не так. Попробуй ещё раз.',
  },

  // Canon Demo Prompts
  'canon.prompt.en': {
    en: 'Start a cleaning business in Berlin. €2k budget. 3 packages: Basic €49, Deep €89, Office €149. Bookings via WhatsApp. Invoice on completion. Refunds require my approval.',
    ru: 'Start a cleaning business in Berlin. €2k budget. 3 packages: Basic €49, Deep €89, Office €149. Bookings via WhatsApp. Invoice on completion. Refunds require my approval.',
  },
  'canon.prompt.ru': {
    en: 'Запусти клининг в Берлине. Бюджет €2k. 3 пакета: Базовый €49, Глубокий €89, Офис €149. Запись через WhatsApp. Счёт после уборки. Возврат только с моего одобрения.',
    ru: 'Запусти клининг в Берлине. Бюджет €2k. 3 пакета: Базовый €49, Глубокий €89, Офис €149. Запись через WhatsApp. Счёт после уборки. Возврат только с моего одобрения.',
  },
} as const;

export type TranslationKey = keyof typeof translations;

// Translation helper function - to be used with LanguageContext
export function getTranslation(key: TranslationKey, language: Language): string {
  const entry = translations[key];
  if (!entry) {
    console.warn(`Missing translation key: ${key}`);
    return key;
  }
  return entry[language] || entry.en || key;
}
