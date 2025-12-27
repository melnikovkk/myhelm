import { forwardRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TranslationKey } from '@/lib/translations';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  { q: 'faq.q1', a: 'faq.a1' },
  { q: 'faq.q2', a: 'faq.a2' },
  { q: 'faq.q3', a: 'faq.a3' },
  { q: 'faq.q4', a: 'faq.a4' },
  { q: 'faq.q5', a: 'faq.a5' },
  // Global questions
  { q: 'faq.q6', a: 'faq.a6' },
  { q: 'faq.q7', a: 'faq.a7' },
  { q: 'faq.q8', a: 'faq.a8' },
  { q: 'faq.q9', a: 'faq.a9' },
  { q: 'faq.q10', a: 'faq.a10' },
  { q: 'faq.q11', a: 'faq.a11' },
] as const;

const FAQ = forwardRef<HTMLElement>((_, ref) => {
  const { t } = useLanguage();

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          {t('faq.title')}
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-12 rounded-full" />

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass-card border-border/50 rounded-lg px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary py-4 hover:no-underline">
                  {t(q as TranslationKey)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {t(a as TranslationKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
});

FAQ.displayName = 'FAQ';

export default FAQ;
