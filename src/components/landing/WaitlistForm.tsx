import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const WaitlistForm = forwardRef<HTMLElement>((_, ref) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'new' | 'digitize'>('new');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({ 
        title: t('error.email.required'), 
        variant: 'destructive' 
      });
      return;
    }
    
    if (!validateEmail(email)) {
      toast({ 
        title: t('error.email.invalid'), 
        variant: 'destructive' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist_signups')
        .insert({
          email,
          prompt: prompt || null,
          mode,
          language,
        });

      if (error) {
        // Handle duplicate email
        if (error.code === '23505') {
          toast({
            title: language === 'ru' ? 'Этот email уже в списке' : 'This email is already on the list',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }
        throw error;
      }

      toast({
        title: t('waitlist.success'),
        description: language === 'ru' ? 'Мы свяжемся с тобой!' : "We'll be in touch!",
      });

      navigate('/thanks');
    } catch (error) {
      console.error('Waitlist submission error:', error);
      toast({
        title: t('error.generic'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="waitlist" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-lg mx-auto">
          <div className="glass-card p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('waitlist.title')}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Mode selector */}
              <RadioGroup
                value={mode}
                onValueChange={(v) => setMode(v as 'new' | 'digitize')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="mode-new" />
                  <Label htmlFor="mode-new" className="text-sm text-foreground cursor-pointer">
                    {t('waitlist.mode.new')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digitize" id="mode-digitize" />
                  <Label htmlFor="mode-digitize" className="text-sm text-foreground cursor-pointer">
                    {t('waitlist.mode.digitize')}
                  </Label>
                </div>
              </RadioGroup>

              {/* Email */}
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('waitlist.email.placeholder')}
                className="bg-background/50"
                required
              />

              {/* Optional prompt */}
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('waitlist.prompt.placeholder')}
                className="bg-background/50 min-h-[80px] resize-none"
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full gap-2 bg-primary text-primary-foreground btn-glow btn-press hover:shadow-glow transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('waitlist.submitting')}
                  </>
                ) : (
                  t('waitlist.submit')
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

WaitlistForm.displayName = 'WaitlistForm';

export default WaitlistForm;