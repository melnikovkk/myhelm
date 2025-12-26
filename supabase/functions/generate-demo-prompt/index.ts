import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      mode, 
      businessType, 
      location, 
      locale, 
      existingBusinessName, 
      painPoints,
      // Enhanced region/industry context
      regionCode,
      currency,
      industryKey,
      industryName,
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating prompt:', { mode, businessType, location, locale, regionCode, currency, industryKey });

    const isDigitize = mode === 'digitize';
    const isRu = locale === 'ru';

    // Region-specific hints for more contextual prompts
    const regionHints: Record<string, { taxHint: string; invoiceHint: string; paymentHint: string }> = {
      DE: { taxHint: 'VAT 19%', invoiceHint: 'German invoice requirements', paymentHint: 'SEPA/Klarna' },
      US: { taxHint: 'Sales tax varies by state', invoiceHint: 'Standard invoicing', paymentHint: 'Cards/ACH' },
      GB: { taxHint: 'VAT 20%', invoiceHint: 'UK invoice requirements', paymentHint: 'Cards/Open Banking' },
      FR: { taxHint: 'VAT 20%', invoiceHint: 'French invoice requirements', paymentHint: 'Cards/SEPA' },
      ES: { taxHint: 'VAT 21%', invoiceHint: 'Spanish invoice requirements', paymentHint: 'Cards/Bizum' },
      IT: { taxHint: 'VAT 22%', invoiceHint: 'Italian e-invoicing (SDI)', paymentHint: 'Cards/SEPA' },
      NL: { taxHint: 'VAT 21%', invoiceHint: 'Dutch invoice requirements', paymentHint: 'iDEAL/Cards' },
      PL: { taxHint: 'VAT 23%', invoiceHint: 'Polish KSeF e-invoicing', paymentHint: 'BLIK/Cards' },
      RU: { taxHint: 'НДС 20%', invoiceHint: 'ОФД/кассовые чеки', paymentHint: 'СБП/карты' },
      AE: { taxHint: 'VAT 5%', invoiceHint: 'UAE invoice requirements', paymentHint: 'Cards/Apple Pay' },
    };

    const regionInfo = regionHints[regionCode as string] || regionHints.US;
    const currencySymbol = currency || 'USD';

    // Industry-specific hints
    const industryHints: Record<string, { offerHint: string; channelHint: string }> = {
      service: { offerHint: 'hourly or package pricing', channelHint: 'WhatsApp/Telegram bookings' },
      ecommerce: { offerHint: 'product catalog with shipping', channelHint: 'website + social media' },
      retail: { offerHint: 'in-store + online sales', channelHint: 'POS + web store' },
      healthcare: { offerHint: 'consultations and treatments', channelHint: 'appointment booking system' },
      manufacturing: { offerHint: 'B2B orders and quotes', channelHint: 'sales team + portal' },
      digital: { offerHint: 'subscriptions or one-time purchases', channelHint: 'website + email marketing' },
      logistics: { offerHint: 'per-delivery or contract pricing', channelHint: 'API + dashboard' },
      other: { offerHint: 'flexible pricing model', channelHint: 'multi-channel approach' },
    };

    const industryInfo = industryHints[industryKey as string] || industryHints.service;

    // Different prompt generation for digitize vs zero
    let systemPrompt: string;
    let userMessage: string;

    if (isDigitize) {
      // Digitize existing business - focus on transformation
      systemPrompt = isRu
        ? `Ты — генератор промптов для HELM — платформы, которая оцифровывает существующие бизнесы.
Твоя задача: написать 2-3 предложения — промпт для оцифровки бизнеса клиента.
Промпт должен:
- Упомянуть название/тип бизнеса клиента
- Описать конкретные улучшения (онлайн-запись, CRM, автоматизация напоминаний и т.д.)
- Включить хотя бы одну деталь про локальные требования: валюту (${currencySymbol}), налоги (${regionInfo.taxHint}), или формат счетов
- Звучать как задача для трансформации, а не создания с нуля
- Быть на русском языке
Примеры:
- "Оцифруй мою автомастерскую в Берлине: внедри онлайн-запись, автоматические напоминания о ТО и учёт клиентов. Счета в EUR с НДС 19%."
- "Переведи мой салон красоты в цифру: CRM для клиентов, онлайн-бронирование через WhatsApp и SMS-напоминания. Возврат только с одобрения CEO."
Отвечай ТОЛЬКО промптом, без объяснений.`
        : `You are a prompt generator for HELM — a platform that digitizes existing businesses.
Your task: write 2-3 sentences — a prompt for digitizing the client's business.
The prompt should:
- Mention the client's business name/type
- Describe specific improvements (online booking, CRM, automated reminders, etc.)
- Include at least one local requirement: currency (${currencySymbol}), taxes (${regionInfo.taxHint}), or invoice format
- Sound like a transformation task, not creation from scratch
- Be in English
Examples:
- "Digitize my auto repair shop in Berlin: add online booking, automatic service reminders, and customer tracking. Invoices in EUR with 19% VAT."
- "Transform my beauty salon to digital: CRM for clients, online scheduling via WhatsApp, and SMS reminders. Refunds require CEO approval."
Reply ONLY with the prompt, no explanations.`;

      userMessage = isRu
        ? `Бизнес: ${existingBusinessName || 'не указан'}. Проблемы: ${painPoints || 'хочу оцифровать'}. ${location ? `Локация: ${location}.` : ''} Валюта: ${currencySymbol}. Налоги: ${regionInfo.taxHint}. Сгенерируй промпт для оцифровки.`
        : `Business: ${existingBusinessName || 'not specified'}. Pain points: ${painPoints || 'want to digitize'}. ${location ? `Location: ${location}.` : ''} Currency: ${currencySymbol}. Tax: ${regionInfo.taxHint}. Generate a digitization prompt.`;
    } else {
      // Start from zero - focus on new business creation with region/industry context
      const businessContextMap: Record<string, { en: string; ru: string }> = {
        service: { ru: 'сервисный бизнес', en: 'service business' },
        ecommerce: { ru: 'e-commerce / товарный бизнес', en: 'e-commerce / product business' },
        retail: { ru: 'розничная торговля', en: 'retail business' },
        healthcare: { ru: 'здравоохранение / медицина', en: 'healthcare business' },
        manufacturing: { ru: 'производство', en: 'manufacturing business' },
        digital: { ru: 'цифровые продукты', en: 'digital products business' },
        logistics: { ru: 'логистика', en: 'logistics business' },
        creator: { ru: 'блогер / автор контента', en: 'content creator / blogger' },
        other: { ru: 'уникальный бизнес', en: 'unique business' },
      };

      const businessInfo = businessContextMap[industryKey as string] || businessContextMap[businessType as string] || businessContextMap.service;
      const businessContext = isRu ? businessInfo.ru : businessInfo.en;
      const locationContext = location ? (isRu ? `в ${location}` : `in ${location}`) : '';

      systemPrompt = isRu
        ? `Ты — генератор демо-промптов для HELM — платформы, которая строит бизнесы с нуля одним промптом.
Твоя задача: написать 2-3 предложения — промпт для запуска нового бизнеса.
Промпт должен:
- Описывать конкретную бизнес-идею (не абстрактную)
- Включать: предложения/цены (в ${currencySymbol}), канал продаж (${industryInfo.channelHint}), правило выставления счетов, политику возврата
- Включить хотя бы одну деталь про регион: валюту или налоговое требование (${regionInfo.taxHint})
- Быть на русском языке
- Звучать как амбициозная, но реалистичная цель
Примеры:
- "Запусти сервис экспресс-доставки здоровой еды для офисных работников в Москве. 3 пакета: Лёгкий ₽599, Стандарт ₽899, Премиум ₽1299. Заказы через Telegram. Счёт при доставке. Возврат с одобрения CEO."
- "Создай клининговую компанию в Берлине. Базовый €49, Глубокий €89, Офис €149. Бронирование через WhatsApp. Счёт после уборки с НДС 19%. Возврат только с моего одобрения."
Отвечай ТОЛЬКО промптом, без объяснений.`
        : `You are a demo prompt generator for HELM — a platform that builds businesses from scratch with one prompt.
Your task: write 2-3 sentences — a prompt for launching a new business.
The prompt should:
- Describe a concrete business idea (not abstract)
- Include: offers/pricing (in ${currencySymbol}), sales channel (${industryInfo.channelHint}), invoicing rule, refund policy
- Include at least one regional detail: currency or tax requirement (${regionInfo.taxHint})
- Be in English
- Sound like an ambitious but realistic goal
Examples:
- "Launch a healthy meal express delivery service for office workers in Berlin. 3 packages: Light €9.99, Standard €14.99, Premium €19.99. Orders via WhatsApp. Invoice on delivery with 19% VAT. Refunds require my approval."
- "Start a cleaning business in London. Basic £49, Deep £89, Office £149. Bookings via WhatsApp. Invoice on completion with 20% VAT. Refunds only with CEO approval."
Reply ONLY with the prompt, no explanations.`;

      userMessage = isRu
        ? `Тип: ${businessContext}${industryName ? ` (${industryName})` : ''}${locationContext ? `. Локация: ${locationContext}` : ''}. Валюта: ${currencySymbol}. Налоги: ${regionInfo.taxHint}. Канал: ${industryInfo.channelHint}. Сгенерируй креативный промпт для запуска нового бизнеса с ценами, каналом продаж и политикой возврата.`
        : `Type: ${businessContext}${industryName ? ` (${industryName})` : ''}${locationContext ? `. Location: ${locationContext}` : ''}. Currency: ${currencySymbol}. Tax: ${regionInfo.taxHint}. Channel: ${industryInfo.channelHint}. Generate a creative prompt for launching a new business with pricing, sales channel, and refund policy.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      if (response.status === 402) {
        throw new Error('Payment required');
      }
      throw new Error(`AI request failed: ${response.status}`);
    }

    const data = await response.json();
    const generatedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!generatedPrompt) {
      throw new Error('No prompt generated');
    }

    console.log('Generated prompt:', generatedPrompt);

    return new Response(
      JSON.stringify({ 
        success: true,
        prompt: generatedPrompt 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error generating prompt:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
