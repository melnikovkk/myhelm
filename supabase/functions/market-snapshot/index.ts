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
    const { businessType, city, locale } = await req.json();

    if (!businessType || !city) {
      return new Response(
        JSON.stringify({ success: false, error: 'businessType and city are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!apiKey) {
      console.error('PERPLEXITY_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Perplexity API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build query based on locale
    const query = locale === 'ru'
      ? `Что важно знать при запуске ${businessType} бизнеса в ${city}? Дай 4-5 ключевых инсайтов о рынке, конкуренции и каналах привлечения клиентов.`
      : `What matters for launching a ${businessType} business in ${city}? Give 4-5 key insights about the market, competition, and customer acquisition channels.`;

    console.log('Perplexity query:', query);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { 
            role: 'system', 
            content: locale === 'ru' 
              ? 'Ты бизнес-аналитик. Давай краткие, конкретные инсайты о рынке. Отвечай на русском языке.' 
              : 'You are a business analyst. Give brief, specific market insights. Be concise and actionable.'
          },
          { role: 'user', content: query }
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `Perplexity API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Perplexity response received');

    const content = data.choices?.[0]?.message?.content || '';
    const citations = data.citations || [];

    // Parse content into bullets
    const bullets = content
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^[-•*\d.]+\s*/, '').trim())
      .filter((line: string) => line.length > 10)
      .slice(0, 5);

    // Format sources
    const sources = citations.slice(0, 3).map((url: string, i: number) => ({
      title: `Source ${i + 1}`,
      url,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          bullets,
          sources,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in market-snapshot:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
