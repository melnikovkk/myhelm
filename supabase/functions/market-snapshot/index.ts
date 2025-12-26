import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketSnapshotRequest {
  businessType: string;
  city: string;
  locale: 'en' | 'ru';
  regionCode?: string;
  currency?: string;
  industryKey?: string;
  queryType?: 'market' | 'regional-rules';
}

// Region-specific market context
const REGION_CONTEXT: Record<string, { market: string; regulations: string }> = {
  US: { market: 'large diverse market with state variations', regulations: 'varies by state, check local licenses' },
  DE: { market: 'regulated market, quality-focused consumers', regulations: '19% VAT, Handwerkskammer for trades' },
  GB: { market: 'competitive market, service-oriented', regulations: '20% VAT above £85k threshold' },
  FR: { market: 'formal business culture, relationship-focused', regulations: '20% TVA, auto-entrepreneur regime available' },
  BR: { market: 'growing digital economy, price-sensitive', regulations: 'Nota Fiscal required, Simples Nacional for SMEs' },
  IN: { market: 'large growing market, mobile-first', regulations: 'GST registration above ₹20L' },
  AU: { market: 'high-income consumers, service quality focus', regulations: '10% GST, ABN required' },
  CA: { market: 'bilingual considerations, US-influenced', regulations: 'GST/HST varies by province' },
  RU: { market: 'growing online services, price-conscious', regulations: 'USN/Patent for small business' },
  AE: { market: 'high spending power, international clientele', regulations: '5% VAT, free zone benefits available' },
};

// Industry-specific angles
const INDUSTRY_CONTEXT: Record<string, { focus: string; channels: string }> = {
  service: { focus: 'booking experience, reliability, reviews', channels: 'WhatsApp, local SEO, referrals' },
  ecommerce: { focus: 'shipping, returns, product photos', channels: 'Instagram, Google Ads, marketplaces' },
  retail: { focus: 'location, foot traffic, local marketing', channels: 'Google Maps, local events, loyalty' },
  healthcare: { focus: 'trust, credentials, patient privacy', channels: 'professional networks, referrals' },
  manufacturing: { focus: 'B2B relationships, quality certs', channels: 'LinkedIn, trade shows, direct sales' },
  digital: { focus: 'user experience, support, updates', channels: 'content marketing, SEO, communities' },
  logistics: { focus: 'reliability, tracking, pricing', channels: 'B2B partnerships, API integrations' },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      businessType, 
      city, 
      locale, 
      regionCode, 
      currency, 
      industryKey,
      queryType = 'market'
    } = await req.json() as MarketSnapshotRequest;

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

    // Get region and industry context
    const regionInfo = regionCode ? REGION_CONTEXT[regionCode] : null;
    const industryInfo = industryKey ? INDUSTRY_CONTEXT[industryKey] : null;
    
    // Build enhanced query with context
    let contextHint = '';
    if (regionInfo) {
      contextHint += ` Market context: ${regionInfo.market}. Regulations: ${regionInfo.regulations}.`;
    }
    if (industryInfo) {
      contextHint += ` Industry focus: ${industryInfo.focus}. Key channels: ${industryInfo.channels}.`;
    }
    if (currency && currency !== 'USD') {
      contextHint += ` Currency: ${currency}.`;
    }

    console.log('Market snapshot request:', { businessType, city, locale, regionCode, industryKey, queryType });

    // Different queries for market vs regional-rules
    let query: string;
    if (queryType === 'regional-rules') {
      query = locale === 'ru'
        ? `Какие правила и требования для ${businessType} бизнеса в ${city}? Налоги, лицензии, обязательные документы.${contextHint} Дай 4-5 конкретных требований.`
        : `What are the rules and requirements for a ${businessType} business in ${city}? Taxes, licenses, mandatory documents.${contextHint} Give 4-5 specific requirements.`;
    } else {
      query = locale === 'ru'
        ? `Что важно знать при запуске ${businessType} бизнеса в ${city}?${contextHint} Дай 4-5 ключевых инсайтов о рынке, конкуренции и каналах привлечения клиентов.`
        : `What matters for launching a ${businessType} business in ${city}?${contextHint} Give 4-5 key insights about the market, competition, and customer acquisition channels.`;
    }

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
              ? 'Ты бизнес-аналитик. Давай краткие, конкретные инсайты о рынке. Отвечай на русском языке. Упоминай конкретные цифры и источники где возможно.' 
              : 'You are a business analyst. Give brief, specific market insights. Be concise and actionable. Mention specific numbers and sources where possible.'
          },
          { role: 'user', content: query }
        ],
        max_tokens: 600,
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

    // Format sources with better titles
    const sources = citations.slice(0, 3).map((url: string, i: number) => {
      // Try to extract domain name for better source title
      let title = `Source ${i + 1}`;
      try {
        const domain = new URL(url).hostname.replace('www.', '');
        title = domain.charAt(0).toUpperCase() + domain.slice(1);
      } catch {
        // Keep default title
      }
      return { title, url };
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          bullets,
          sources,
          context: {
            region: regionCode,
            industry: industryKey,
            currency,
          },
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
