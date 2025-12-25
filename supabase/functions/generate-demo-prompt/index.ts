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
    const { mode, businessType, location, locale } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating prompt:', { mode, businessType, location, locale });

    // Build context for prompt generation
    const modeContext = mode === 'zero' 
      ? (locale === 'ru' ? 'запуск нового бизнеса с нуля' : 'starting a new business from scratch')
      : (locale === 'ru' ? 'оцифровка существующего бизнеса' : 'digitizing an existing business');

    const businessContextMap: Record<string, { en: string; ru: string }> = {
      service: { 
        ru: 'сервисный бизнес (клининг, ремонт, консалтинг и т.д.)', 
        en: 'service business (cleaning, repair, consulting, etc.)' 
      },
      ecommerce: { 
        ru: 'интернет-магазин или товарный бизнес', 
        en: 'e-commerce or product business' 
      },
      creator: { 
        ru: 'блогер, автор контента, инфобизнес', 
        en: 'content creator, blogger, info-business' 
      },
      other: { 
        ru: 'уникальный или нишевый бизнес', 
        en: 'unique or niche business' 
      },
    };

    const businessInfo = businessContextMap[businessType as string] || businessContextMap.other;
    const businessContext = locale === 'ru' ? businessInfo.ru : businessInfo.en;

    const locationContext = location 
      ? (locale === 'ru' ? `в ${location}` : `in ${location}`) 
      : '';

    const systemPrompt = locale === 'ru'
      ? `Ты — генератор демо-промптов для платформы HELM, которая запускает бизнесы одним промптом.
Твоя задача: написать 1-2 предложения — реалистичный, конкретный промпт для демо.
Промпт должен:
- Описывать конкретную бизнес-идею (не абстрактную)
- Включать тип услуги/продукта и целевую аудиторию
- Быть на русском языке
- Быть вдохновляющим, но реалистичным
Примеры хороших промптов:
- "Запусти сервис экспресс-уборки квартир для занятых профессионалов в Москве"
- "Создай магазин крафтовых свечей ручной работы с доставкой по СНГ"
- "Помоги оцифровать мою автомастерскую: онлайн-запись, напоминания, учёт"
Отвечай ТОЛЬКО промптом, без объяснений.`
      : `You are a demo prompt generator for HELM platform that launches businesses with one prompt.
Your task: write 1-2 sentences — a realistic, specific demo prompt.
The prompt should:
- Describe a concrete business idea (not abstract)
- Include the type of service/product and target audience
- Be in English
- Be inspiring but realistic
Examples of good prompts:
- "Launch an express apartment cleaning service for busy professionals in Berlin"
- "Create a handmade craft candle shop with EU-wide delivery"
- "Help digitize my auto repair shop: online booking, reminders, inventory"
Reply ONLY with the prompt, no explanations.`;

    const userMessage = locale === 'ru'
      ? `Сгенерируй промпт для: ${modeContext}, ${businessContext}${locationContext ? ` ${locationContext}` : ''}. Будь конкретен и креативен.`
      : `Generate a prompt for: ${modeContext}, ${businessContext}${locationContext ? ` ${locationContext}` : ''}. Be specific and creative.`;

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
