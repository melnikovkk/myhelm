import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { saveWaitlistEntry, emailExists } from '@/lib/storage';

const WaitlistForm = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'new' | 'digitize'>('new');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoMode] = useState(true); // Will be false when Supabase is connected

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
      // Demo mode: save to localStorage
      if (isDemoMode) {
        if (emailExists(email)) {
          toast({
            title: language === 'ru' ? 'Этот email уже в списке' : 'This email is already on the list',
            variant: 'destructive',
          });
          setIsSubmitting(false);
          return;
        }

        saveWaitlistEntry({
          email,
          prompt: prompt || undefined,
          mode,
          language,
        });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
      } else {
        // TODO: Supabase integration
        // const { error } = await supabase.from('waitlist_signups').insert({
        //   email,
        //   prompt: prompt || null,
        //   mode,
        //   language,
        // });
      }

      toast({
        title: t('waitlist.success'),
        description: language === 'ru' ? 'Мы свяжемся с тобой!' : "We'll be in touch!",
      });

      navigate('/thanks');
    } catch (error) {
      toast({
        title: t('error.generic'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-lg mx-auto">
          {/* Demo mode banner */}
          {isDemoMode && (
            <div className="mb-6 p-3 rounded-lg bg-accent/10 border border-accent/30 flex items-center gap-2 text-sm text-accent">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {t('waitlist.demo.banner')}
            </div>
          )}

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
                className="w-full gap-2 bg-primary text-primary-foreground btn-glow"
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
};

export default WaitlistForm;
