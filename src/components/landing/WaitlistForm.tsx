import { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
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
      toast({ title: t('error.email.required'), variant: 'destructive' });
      return;
    }
    
    if (!validateEmail(email)) {
      toast({ title: t('error.email.invalid'), variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waitlist_signups')
        .insert({ email, prompt: prompt || null, mode, language });

      if (error) {
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
      toast({ title: t('error.generic'), variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="waitlist" className="py-20 md:py-28 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                {t('waitlist.title')}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <RadioGroup
                value={mode}
                onValueChange={(v) => setMode(v as 'new' | 'digitize')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="mode-new" />
                  <Label htmlFor="mode-new" className="text-sm cursor-pointer text-foreground">
                    {t('waitlist.mode.new')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="digitize" id="mode-digitize" />
                  <Label htmlFor="mode-digitize" className="text-sm cursor-pointer text-foreground">
                    {t('waitlist.mode.digitize')}
                  </Label>
                </div>
              </RadioGroup>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('waitlist.email.placeholder')}
                className="h-11"
                required
              />

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('waitlist.prompt.placeholder')}
                className="min-h-[88px] resize-none text-sm"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 font-medium"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
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