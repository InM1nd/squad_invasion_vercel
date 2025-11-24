import { Button } from "@/components/ui/button";
import type { ScheduleBlock } from "@/lib/types";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

const accentStyles: Record<
  ScheduleBlock["accent"],
  { container: string; badge: string }
> = {
  rose: {
    container:
      "border border-rose-200 bg-white text-foreground dark:bg-rose-500/5 dark:text-rose-100 dark:border-rose-500/40",
    badge:
      "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-100 dark:border-rose-500/40",
  },
  violet: {
    container:
      "border border-violet-200 bg-white text-foreground dark:bg-violet-500/5 dark:text-violet-100 dark:border-violet-500/40",
    badge:
      "bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-500/20 dark:text-violet-100 dark:border-violet-500/40",
  },
  cyan: {
    container:
      "border border-cyan-200 bg-white text-foreground dark:bg-cyan-500/5 dark:text-cyan-100 dark:border-cyan-500/40",
    badge:
      "bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-100 dark:border-cyan-500/40",
  },
  amber: {
    container:
      "border border-amber-200 bg-white text-foreground dark:bg-amber-500/5 dark:text-amber-100 dark:border-amber-500/40",
    badge:
      "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-100 dark:border-amber-500/40",
  },
};

interface ScheduleSectionProps {
  blocks: ScheduleBlock[];
}

export async function ScheduleSection({ blocks }: ScheduleSectionProps) {
  const t = await getTranslations("schedule");

  return (
    <section id="schedule" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col gap-6 text-left">
          <div className="space-y-2 md:self-start">
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t("title")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                {t("description")}
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="self-start">
            <Link href="/rules">{t("cta")}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {blocks.map((block) => {
            const accent = accentStyles[block.accent];
            const baseKey = block.translationKey;
            return (
              <div
                key={block.id}
                className={cn(
                  "rounded-[28px] border p-6 shadow-sm backdrop-blur",
                  accent.container,
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]",
                    accent.badge,
                  )}
                >
                  {t(`${baseKey}.label`)}
                </span>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {t(`${baseKey}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`${baseKey}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

