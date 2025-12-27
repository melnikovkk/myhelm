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
  'tab.region': {
    en: 'Region',
    ru: 'Регион',
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

  // Coverage Map - 12 DOMAINS
  'coverage.title': {
    en: '12-Domain Business Coverage',
    ru: 'Покрытие бизнеса из 12 доменов',
  },
  'coverage.subtitle': {
    en: 'HELM builds your Business Program across every domain. CEO decides only when risk is high — always with proof.',
    ru: 'HELM строит твою Бизнес-Программу по всем доменам. CEO решает только при высоких рисках — всегда с доказательствами.',
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
  'coverage.expand': {
    en: 'Click to see details',
    ru: 'Нажми для деталей',
  },

  // 12 Domain L1 Names
  'coverage.domain.gtm': {
    en: 'Go-to-Market',
    ru: 'Выход на рынок',
  },
  'coverage.domain.customer': {
    en: 'Customer Lifecycle',
    ru: 'Жизненный цикл клиента',
  },
  'coverage.domain.delivery': {
    en: 'Delivery & Ops',
    ru: 'Доставка и операции',
  },
  'coverage.domain.supply': {
    en: 'Supply & Procurement',
    ru: 'Закупки и поставки',
  },
  'coverage.domain.money': {
    en: 'Money & Revenue',
    ru: 'Деньги и выручка',
  },
  'coverage.domain.accounting': {
    en: 'Accounting & Reporting',
    ru: 'Учёт и отчётность',
  },
  'coverage.domain.legal': {
    en: 'Legal & Policies',
    ru: 'Право и политики',
  },
  'coverage.domain.risk': {
    en: 'Risk & Controls',
    ru: 'Риски и контроль',
  },
  'coverage.domain.people': {
    en: 'People & Workforce',
    ru: 'Люди и персонал',
  },
  'coverage.domain.assets': {
    en: 'Assets & Inventory',
    ru: 'Активы и инвентарь',
  },
  'coverage.domain.support': {
    en: 'Support & Recovery',
    ru: 'Поддержка и восстановление',
  },
  'coverage.domain.data': {
    en: 'Data & Security',
    ru: 'Данные и безопасность',
  },

  // Old 8-domain keys (keep for backwards compat in CoverageTab)
  'coverage.domain.sell': {
    en: 'Sell',
    ru: 'Продажа',
  },
  'coverage.domain.deliver': {
    en: 'Deliver',
    ru: 'Доставка',
  },
  'coverage.domain.reporting': {
    en: 'Reporting',
    ru: 'Отчётность',
  },

  // Region Tab - 7 Axes
  'region.axis.localization': {
    en: 'Localization',
    ru: 'Локализация',
  },
  'region.axis.taxes': {
    en: 'Taxes',
    ru: 'Налоги',
  },
  'region.axis.invoicing': {
    en: 'Invoicing & E-Invoicing',
    ru: 'Счета и электронный документооборот',
  },
  'region.axis.payments': {
    en: 'Payment Rails',
    ru: 'Платёжные рельсы',
  },
  'region.axis.accounting': {
    en: 'Accounting Exports',
    ru: 'Экспорт в бухгалтерию',
  },
  'region.axis.privacy': {
    en: 'Privacy & Data Residency',
    ru: 'Приватность и хранение данных',
  },
  'region.axis.workforce': {
    en: 'Workforce & Payroll',
    ru: 'Персонал и выплаты',
  },
  'region.generates': {
    en: 'HELM generates',
    ru: 'HELM генерирует',
  },
  'region.ceo.decides': {
    en: 'CEO decides',
    ru: 'CEO решает',
  },
  'region.proof.produced': {
    en: 'Proof produced',
    ru: 'Доказательства',
  },
  'region.readiness.ready': {
    en: 'Ready',
    ru: 'Готово',
  },
  'region.readiness.planned': {
    en: 'Planned',
    ru: 'Планируется',
  },
  'region.readiness.human': {
    en: 'Human-bridge',
    ru: 'Human-bridge',
  },
  'region.select': {
    en: 'Select a region above to see jurisdiction details',
    ru: 'Выбери регион выше для деталей юрисдикции',
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
    en: 'Proof-First Architecture',
    ru: 'Архитектура с доказательствами',
  },
  'proof.subtitle': {
    en: 'Every decision, every action — recorded with proof. Deterministic replay. Immutable audit.',
    ru: 'Каждое решение, каждое действие — записано с доказательством. Детерминированный повтор. Неизменяемый аудит.',
  },
  'proof.replay': {
    en: 'Deterministic Replay',
    ru: 'Детерминированный повтор',
  },
  'proof.replay.desc': {
    en: 'Every test day can be replayed exactly as it happened',
    ru: 'Каждый тестовый день можно повторить в точности как было',
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

  // FAQ - UPDATED FOR 12 DOMAINS + GLOBAL
  'faq.title': {
    en: 'Questions',
    ru: 'Вопросы',
  },
  'faq.q1': {
    en: 'What can I build with HELM?',
    ru: 'Что можно построить с HELM?',
  },
  'faq.a1': {
    en: 'HELM builds and runs a complete Business Program for any online, offline, or hybrid business. It covers all 12 business domains — from Go-to-Market to Data & Security. Start from zero with just an idea, or digitize an existing business. CEO-only decisions for high-risk moments, always recorded with proof.',
    ru: 'HELM создаёт и ведёт полную Бизнес-Программу для любого онлайн, офлайн или гибридного бизнеса. Покрывает все 12 бизнес-доменов — от Выхода на рынок до Данных и безопасности. Начни с нуля с идеи или оцифруй существующий бизнес. Решения CEO только при высоких рисках — всегда с доказательствами.',
  },
  'faq.q2': {
    en: 'Do I need technical skills?',
    ru: 'Нужны ли технические навыки?',
  },
  'faq.a2': {
    en: 'No. Describe what you want in plain words. HELM generates your Business Program — the operating system that defines how your business works. You make CEO decisions only when risk is high.',
    ru: 'Нет. Опиши, что хочешь, обычными словами. HELM сгенерирует твою Бизнес-Программу — операционную систему, которая определяет, как работает бизнес. Ты принимаешь решения CEO только при высоких рисках.',
  },
  'faq.q3': {
    en: 'How is this different from other tools?',
    ru: 'Чем это отличается от других инструментов?',
  },
  'faq.a3': {
    en: 'Other tools help you organize tasks or manage parts of a business. HELM is a business builder: it creates your entire operating system from a prompt, executes it end-to-end across 12 domains, and gives you proof of every action and decision. You stay CEO — the system handles execution.',
    ru: 'Другие инструменты помогают организовать задачи или управлять частями бизнеса. HELM — это конструктор бизнеса: создаёт всю операционную систему из промпта, исполняет её от и до по 12 доменам и даёт доказательства каждого действия и решения. Ты остаёшься CEO — система занимается исполнением.',
  },
  'faq.q4': {
    en: 'When does it launch?',
    ru: 'Когда запуск?',
  },
  'faq.a4': {
    en: '2026. Join the waitlist to get early access and shape what we build.',
    ru: '2026. Вступай в список ожидания, чтобы получить ранний доступ и влиять на то, что мы строим.',
  },
  'faq.q5': {
    en: 'What is the coverage contract?',
    ru: 'Что такое контракт покрытия?',
  },
  'faq.a5': {
    en: 'HELM covers 12 business domains with 72+ capabilities. Some are Ready now, others Planned, and complex edge cases use Human-bridge until fully automated. We\'re transparent about readiness for every capability in every region.',
    ru: 'HELM покрывает 12 бизнес-доменов с 72+ возможностями. Некоторые Готовы сейчас, другие Планируются, сложные случаи используют Human-bridge до полной автоматизации. Мы прозрачны о готовности каждой функции в каждом регионе.',
  },
  'faq.q6': {
    en: 'How does this work in my country?',
    ru: 'Как это работает в моей стране?',
  },
  'faq.a6': {
    en: 'HELM adapts to your region via Jurisdiction Packs — local overlays that configure invoices, taxes, payments, privacy, accounting exports, and payroll rules. Select your country in the demo Region tab to see 7 readiness axes: Localization, Taxes, Invoicing, Payments, Accounting, Privacy, Workforce.',
    ru: 'HELM адаптируется к вашему региону через Юрисдикционные пакеты — локальные настройки счетов, налогов, платежей, приватности, экспорта в бухгалтерию и выплат. Выбери страну во вкладке Регион демо, чтобы увидеть 7 осей готовности: Локализация, Налоги, Счета, Платежи, Бухгалтерия, Приватность, Персонал.',
  },
  'faq.q7': {
    en: 'How do taxes and invoices change per region?',
    ru: 'Как налоги и счета меняются по регионам?',
  },
  'faq.a7': {
    en: 'Each region has specific VAT rates, invoice formats, and e-invoicing requirements. HELM generates compliant invoices automatically — you choose the tax regime and approve exceptions. All documents are archived with timestamps.',
    ru: 'У каждого региона свои ставки НДС, форматы счетов и требования к e-invoicing. HELM генерирует соответствующие счета автоматически — вы выбираете налоговый режим и одобряете исключения. Все документы архивируются с метками времени.',
  },
  'faq.q8': {
    en: 'Can I run offline and online business together?',
    ru: 'Можно ли вести офлайн и онлайн бизнес вместе?',
  },
  'faq.a8': {
    en: 'Yes. HELM runs hybrid businesses — online bookings, physical delivery, digital payments. The Business Program adapts to your channels and syncs everything into one operating system.',
    ru: 'Да. HELM ведёт гибридный бизнес — онлайн бронирования, физическая доставка, цифровые платежи. Бизнес-Программа адаптируется к вашим каналам и синхронизирует всё в одну операционную систему.',
  },
  'faq.q9': {
    en: 'What\'s Ready vs Planned vs Human-bridge?',
    ru: 'Что значит Готово vs Планируется vs Human-bridge?',
  },
  'faq.a9': {
    en: 'Ready = fully operational, works today. Planned = in development, ETA shown. Human-bridge = complex edge cases handled by humans until fully automated. We\'re transparent about readiness for every capability in every region.',
    ru: 'Готово = полностью работает сегодня. Планируется = в разработке, показан срок. Human-bridge = сложные случаи обрабатываются людьми до полной автоматизации. Мы прозрачны о готовности каждой функции в каждом регионе.',
  },
  'faq.q10': {
    en: 'What industries does it support?',
    ru: 'Какие отрасли поддерживаются?',
  },
  'faq.a10': {
    en: 'HELM supports 8 industry packs: Service, E-commerce, Retail, Healthcare, Manufacturing, Digital Products, Logistics, and Custom. Each pack includes industry-specific compliance notes, typical offers, and regional adaptations.',
    ru: 'HELM поддерживает 8 отраслевых пакетов: Услуги, E-commerce, Розница, Здравоохранение, Производство, Цифровые продукты, Логистика и Другое. Каждый пакет включает отраслевые требования, типичные предложения и региональные адаптации.',
  },
  'faq.q11': {
    en: 'What proof do I get?',
    ru: 'Какие доказательства я получу?',
  },
  'faq.a11': {
    en: 'Photo confirmations, signed decisions, receipts & transactions, immutable audit trails. Every action is timestamped and linked to the decision that triggered it. Test days can be replayed exactly as they happened.',
    ru: 'Фото подтверждения, подписанные решения, чеки и транзакции, неизменяемые аудит-трейлы. Каждое действие имеет временную метку и связано с решением, которое его вызвало. Тестовые дни можно повторить в точности как было.',
  },

  // Footer
  'footer.tagline': {
    en: 'The business builder. You stay CEO.',
    ru: 'Конструктор бизнеса. Ты остаёшься CEO.',
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
