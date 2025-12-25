import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Whitelist of fields to extract - SECURITY: only extract these, never raw page content
const WHITELIST_FIELDS = ['services', 'packages', 'prices', 'contact', 'positioning'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, locale } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Scanning competitor URL:', formattedUrl);

    // Use Firecrawl with JSON extraction for structured data only
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: [
          {
            type: 'json',
            schema: {
              type: 'object',
              properties: {
                services: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of services offered'
                },
                packages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      price: { type: 'string' }
                    }
                  },
                  description: 'Service packages with names and prices'
                },
                contact: {
                  type: 'string',
                  description: 'Contact methods (phone, email, WhatsApp, etc.)'
                },
                positioning: {
                  type: 'string',
                  description: 'One sentence about their unique value proposition or focus'
                }
              }
            },
            prompt: locale === 'ru'
              ? 'Извлеки информацию о услугах, пакетах с ценами, контактах и уникальном предложении компании.'
              : 'Extract information about services offered, packages with prices, contact methods, and their unique value proposition.'
          }
        ],
        onlyMainContent: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Firecrawl API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: `Firecrawl API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('Firecrawl response received');

    // SECURITY: Only extract whitelisted fields, never pass raw content
    const extractedData = result.data?.json || {};
    
    const sanitizedData = {
      services: Array.isArray(extractedData.services) ? extractedData.services.slice(0, 5) : [],
      packages: Array.isArray(extractedData.packages) ? extractedData.packages.slice(0, 4).map((p: any) => ({
        name: typeof p.name === 'string' ? p.name.slice(0, 50) : '',
        price: typeof p.price === 'string' ? p.price.slice(0, 20) : '',
      })) : [],
      contact: typeof extractedData.contact === 'string' ? extractedData.contact.slice(0, 100) : '',
      positioning: typeof extractedData.positioning === 'string' ? extractedData.positioning.slice(0, 200) : '',
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: sanitizedData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in competitor-scan:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
