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
    const { mode, businessType, location, locale, existingBusinessName, painPoints } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating prompt:', { mode, businessType, location, locale, existingBusinessName });

    const isDigitize = mode === 'digitize';
    const isRu = locale === 'ru';

    // Different prompt generation for digitize vs zero
    let systemPrompt: string;
    let userMessage: string;

    if (isDigitize) {
      // Digitize existing business - focus on transformation
      systemPrompt = isRu
        ? `Ты — генератор промптов для HELM — платформы, которая оцифровывает существующие бизнесы.
Твоя задача: написать 1-2 предложения — промпт для оцифровки бизнеса клиента.
Промпт должен:
- Упомянуть название/тип бизнеса клиента
- Описать конкретные улучшения (онлайн-запись, CRM, автоматизация напоминаний и т.д.)
- Звучать как задача для трансформации, а не создания с нуля
- Быть на русском языке
Примеры:
- "Оцифруй мою автомастерскую: внедри онлайн-запись, автоматические напоминания о ТО и учёт клиентов"
- "Переведи мой салон красоты в цифру: CRM для клиентов, онлайн-бронирование и SMS-напоминания"
Отвечай ТОЛЬКО промптом, без объяснений.`
        : `You are a prompt generator for HELM — a platform that digitizes existing businesses.
Your task: write 1-2 sentences — a prompt for digitizing the client's business.
The prompt should:
- Mention the client's business name/type
- Describe specific improvements (online booking, CRM, automated reminders, etc.)
- Sound like a transformation task, not creation from scratch
- Be in English
Examples:
- "Digitize my auto repair shop: add online booking, automatic service reminders, and customer tracking"
- "Transform my beauty salon to digital: CRM for clients, online scheduling, and SMS reminders"
Reply ONLY with the prompt, no explanations.`;

      userMessage = isRu
        ? `Бизнес: ${existingBusinessName || 'не указан'}. Проблемы: ${painPoints || 'хочу оцифровать'}. ${location ? `Локация: ${location}.` : ''} Сгенерируй промпт для оцифровки.`
        : `Business: ${existingBusinessName || 'not specified'}. Pain points: ${painPoints || 'want to digitize'}. ${location ? `Location: ${location}.` : ''} Generate a digitization prompt.`;
    } else {
      // Start from zero - focus on new business creation
      const businessContextMap: Record<string, { en: string; ru: string }> = {
        service: { 
          ru: 'сервисный бизнес', 
          en: 'service business' 
        },
        ecommerce: { 
          ru: 'e-commerce / товарный бизнес', 
          en: 'e-commerce / product business' 
        },
        creator: { 
          ru: 'блогер / автор контента', 
          en: 'content creator / blogger' 
        },
        other: { 
          ru: 'уникальный бизнес', 
          en: 'unique business' 
        },
      };

      const businessInfo = businessContextMap[businessType as string] || businessContextMap.other;
      const businessContext = isRu ? businessInfo.ru : businessInfo.en;
      const locationContext = location ? (isRu ? `в ${location}` : `in ${location}`) : '';

      systemPrompt = isRu
        ? `Ты — генератор демо-промптов для HELM — платформы, которая строит бизнесы с нуля одним промптом.
Твоя задача: написать 1-2 предложения — промпт для запуска нового бизнеса.
Промпт должен:
- Описывать конкретную бизнес-идею (не абстрактную)
- Включать тип продукта/услуги и целевую аудиторию
- Быть на русском языке
- Звучать как амбициозная, но реалистичная цель
Примеры:
- "Запусти сервис экспресс-доставки здоровой еды для офисных работников в Москве"
- "Создай онлайн-школу английского для IT-специалистов с гибким расписанием"
Отвечай ТОЛЬКО промптом, без объяснений.`
        : `You are a demo prompt generator for HELM — a platform that builds businesses from scratch with one prompt.
Your task: write 1-2 sentences — a prompt for launching a new business.
The prompt should:
- Describe a concrete business idea (not abstract)
- Include the type of product/service and target audience
- Be in English
- Sound like an ambitious but realistic goal
Examples:
- "Launch a healthy meal express delivery service for office workers in Berlin"
- "Create an online English school for IT professionals with flexible scheduling"
Reply ONLY with the prompt, no explanations.`;

      userMessage = isRu
        ? `Тип: ${businessContext}${locationContext ? `. Локация: ${locationContext}` : ''}. Сгенерируй креативный промпт для запуска нового бизнеса.`
        : `Type: ${businessContext}${locationContext ? `. Location: ${locationContext}` : ''}. Generate a creative prompt for launching a new business.`;
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
        max_tokens: 150,
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
