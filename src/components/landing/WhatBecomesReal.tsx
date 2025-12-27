import { useLanguage } from "@/hooks/useLanguage";
import { FileText, Repeat2, ShieldCheck } from "lucide-react";

const WhatBecomesReal = () => {
  const { t } = useLanguage();

  const items = [
    {
      icon: FileText,
      title: t("artifact.blueprint.title"),
      description: t("real.blueprint.desc"),
    },
    {
      icon: Repeat2,
      title: t("artifact.os.title"),
      description: t("real.os.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("artifact.launch.title"),
      description: t("real.proof.desc"),
    },
  ] as const;

  return (
    <section aria-labelledby="what-becomes-real" className="py-18 md:py-24 border-t border-border">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-10 md:mb-12">
            <h2 id="what-becomes-real" className="text-2xl md:text-3xl font-semibold text-foreground">
              {t("real.title")}
            </h2>
          </header>

          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            {items.map(({ icon: Icon, title, description }) => (
              <article key={title} className="bg-card border border-border rounded-2xl p-5 md:p-6">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatBecomesReal;
