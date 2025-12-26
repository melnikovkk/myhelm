import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ArtifactRequest {
  prompt: string;
  locale: 'en' | 'ru';
  mode?: 'zero' | 'digitize';
  regionCode?: string;
  currency?: string;
  industryKey?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, locale, mode = 'zero', regionCode, currency, industryKey } = await req.json() as ArtifactRequest;

    if (!prompt) {
      return new Response(
        JSON.stringify({ success: false, error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating artifacts:', { mode, regionCode, currency, industryKey, promptPreview: prompt.substring(0, 100) });

    const isRu = locale === 'ru';
    const isDigitize = mode === 'digitize';
    const currencySymbol = currency || 'USD';
    
    // Different system prompts for zero vs digitize modes
    let systemPrompt: string;
    
    if (isDigitize) {
      systemPrompt = isRu 
        ? `Ты бизнес-архитектор, специализирующийся на цифровой трансформации. Создай план оцифровки существующего бизнеса.

Верни ТОЛЬКО валидный JSON (без markdown, без \`\`\`) в следующем формате:
{
  "name": "Название бизнеса (используй название из промпта или придумай)",
  "tagline": "Слоган трансформации (например: 'Из блокнота в автопилот')",
  "packages": [
    {"name": "Базовая оцифровка", "price": "${currencySymbol}XX/мес", "description": "Что включено"},
    {"name": "Полная автоматизация", "price": "${currencySymbol}XX/мес", "description": "Что включено"},
    {"name": "Премиум + поддержка", "price": "${currencySymbol}XX/мес", "description": "Что включено"}
  ],
  "target": "Текущие клиенты и как их обслуживание улучшится",
  "channel": "Новый цифровой канал (WhatsApp/Telegram/CRM)",
  "week1Goals": ["Цель миграции 1", "Цель миграции 2", "Цель миграции 3"],
  "roles": ["Роль 1 (автоматизирована)", "Роль 2", "Роль 3"],
  "loops": {
    "sell": "Новая воронка продаж (было → стало)",
    "deliver": "Новый процесс доставки (было → стало)",
    "money": "Новый процесс оплаты (было → стало)",
    "support": "Новый процесс поддержки (было → стало)"
  },
  "policies": ["Политика миграции данных", "Политика уведомлений клиентов", "Политика резервного копирования"],
  "kpis": ["KPI улучшения 1", "KPI улучшения 2", "KPI улучшения 3"],
  "migrationPlan": ["Шаг 1: Аудит текущих процессов", "Шаг 2: Импорт данных клиентов", "Шаг 3: Настройка автоматизаций", "Шаг 4: Обучение команды"],
  "automations": ["Автоматическое напоминание клиентам", "Авто-счета после услуги", "Авто-запись на повторный визит"],
  "beforeAfter": [
    {"before": "Записи в блокноте", "after": "CRM с историей клиентов"},
    {"before": "Ручные напоминания", "after": "Авто-SMS за 24ч"},
    {"before": "Наличные/перевод", "after": "Онлайн-оплата + чек"}
  ]
}`
        : `You are a business architect specializing in digital transformation. Create a digitization plan for an existing business.

Return ONLY valid JSON (no markdown, no \`\`\`) in this format:
{
  "name": "Business name (use name from prompt or create one)",
  "tagline": "Transformation tagline (e.g., 'From notebook to autopilot')",
  "packages": [
    {"name": "Basic Digitization", "price": "${currencySymbol}XX/mo", "description": "What's included"},
    {"name": "Full Automation", "price": "${currencySymbol}XX/mo", "description": "What's included"},
    {"name": "Premium + Support", "price": "${currencySymbol}XX/mo", "description": "What's included"}
  ],
  "target": "Current customers and how their experience improves",
  "channel": "New digital channel (WhatsApp/Telegram/CRM)",
  "week1Goals": ["Migration goal 1", "Migration goal 2", "Migration goal 3"],
  "roles": ["Role 1 (automated)", "Role 2", "Role 3"],
  "loops": {
    "sell": "New sales funnel (was → now)",
    "deliver": "New delivery process (was → now)",
    "money": "New payment process (was → now)",
    "support": "New support process (was → now)"
  },
  "policies": ["Data migration policy", "Customer notification policy", "Backup policy"],
  "kpis": ["Improvement KPI 1", "Improvement KPI 2", "Improvement KPI 3"],
  "migrationPlan": ["Step 1: Audit current processes", "Step 2: Import customer data", "Step 3: Set up automations", "Step 4: Train team"],
  "automations": ["Auto customer reminders", "Auto invoicing after service", "Auto rebooking prompts"],
  "beforeAfter": [
    {"before": "Paper records", "after": "CRM with customer history"},
    {"before": "Manual reminders", "after": "Auto-SMS 24h before"},
    {"before": "Cash/transfer", "after": "Online payment + receipt"}
  ]
}`;
    } else {
      // Original "start from zero" prompt with region/industry awareness
      systemPrompt = isRu 
        ? `Ты бизнес-архитектор. Создай полный план запуска бизнеса на основе промпта пользователя.
${regionCode ? `Регион: ${regionCode}, валюта: ${currencySymbol}. Используй эту валюту для цен.` : ''}
${industryKey ? `Отрасль: ${industryKey}. Адаптируй предложения под эту отрасль.` : ''}

Верни ТОЛЬКО валидный JSON (без markdown, без \`\`\`) в следующем формате:
{
  "name": "Название бизнеса (придумай креативное)",
  "tagline": "Короткий слоган (5-8 слов)",
  "packages": [
    {"name": "Базовый", "price": "${currencySymbol}XX", "description": "Краткое описание"},
    {"name": "Стандарт", "price": "${currencySymbol}XX", "description": "Краткое описание"},
    {"name": "Премиум", "price": "${currencySymbol}XX", "description": "Краткое описание"}
  ],
  "target": "Описание целевой аудитории (1-2 предложения)",
  "channel": "Основной канал продаж (WhatsApp/Telegram/Instagram/Website)",
  "week1Goals": ["Цель 1", "Цель 2", "Цель 3"],
  "roles": ["Роль 1", "Роль 2", "Роль 3"],
  "loops": {
    "sell": "Воронка продаж в 3-4 шага",
    "deliver": "Процесс доставки услуги/товара",
    "money": "Процесс оплаты",
    "support": "Процесс поддержки клиентов"
  },
  "policies": ["Политика возврата", "Политика скидок", "Политика переносов"],
  "kpis": ["KPI 1", "KPI 2", "KPI 3"]
}`
        : `You are a business architect. Create a complete business launch plan based on the user's prompt.
${regionCode ? `Region: ${regionCode}, currency: ${currencySymbol}. Use this currency for all prices.` : ''}
${industryKey ? `Industry: ${industryKey}. Adapt offerings to this industry.` : ''}

Return ONLY valid JSON (no markdown, no \`\`\`) in this format:
{
  "name": "Business name (create something catchy)",
  "tagline": "Short tagline (5-8 words)",
  "packages": [
    {"name": "Basic", "price": "${currencySymbol}XX", "description": "Brief description"},
    {"name": "Standard", "price": "${currencySymbol}XX", "description": "Brief description"},
    {"name": "Premium", "price": "${currencySymbol}XX", "description": "Brief description"}
  ],
  "target": "Target audience description (1-2 sentences)",
  "channel": "Primary sales channel (WhatsApp/Telegram/Instagram/Website)",
  "week1Goals": ["Goal 1", "Goal 2", "Goal 3"],
  "roles": ["Role 1", "Role 2", "Role 3"],
  "loops": {
    "sell": "Sales funnel in 3-4 steps",
    "deliver": "Service/product delivery process",
    "money": "Payment process",
    "support": "Customer support process"
  },
  "policies": ["Refund policy", "Discount policy", "Reschedule policy"],
  "kpis": ["KPI 1", "KPI 2", "KPI 3"]
}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'Payment required.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';
    
    // Clean up the response
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    console.log('Raw AI response:', content.substring(0, 300));

    try {
      const artifacts = JSON.parse(content);
      console.log('Successfully parsed artifacts for:', artifacts.name, 'mode:', mode);
      
      return new Response(
        JSON.stringify({ success: true, artifacts }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content.substring(0, 500));
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in generate-artifacts:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});