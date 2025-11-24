import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface IntelItem {
  id: string;
  translationKey: string;
  status: "up" | "steady" | "down";
}

const statusIconMap: Record<
  IntelItem["status"],
  { color: string; icon: ReactNode }
> = {
  up: {
    color: "text-emerald-500",
    icon: <ArrowUpRight className="h-4 w-4" />,
  },
  down: {
    color: "text-rose-500",
    icon: <ArrowDownRight className="h-4 w-4" />,
  },
  steady: {
    color: "text-amber-500",
    icon: <Activity className="h-4 w-4" />,
  },
};

interface IntelFeedSectionProps {
  intel: IntelItem[];
}

export async function IntelFeedSection({ intel }: IntelFeedSectionProps) {
  const t = await getTranslations("intel");

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-3 mb-12 text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intel.map((item) => {
            const statusToken = statusIconMap[item.status];
            const baseKey = item.translationKey;
            const deltaColor = statusToken.color;

            return (
              <Card
                key={item.id}
                className="p-6 h-full border border-border/70 bg-card/90 backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {t(`${baseKey}.timestamp`)}
                    </p>
                    <h3 className="text-xl font-semibold text-foreground">
                      {t(`${baseKey}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`${baseKey}.detail`)}
                    </p>
                  </div>
                  <Badge variant="secondary">{t("badge")}</Badge>
                </div>

                <div className="mt-6 flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-sm uppercase text-muted-foreground">
                      {t("metricLabel")}
                    </p>
                    <p className="text-4xl font-bold text-foreground">
                      {t(`${baseKey}.value`)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <span className={deltaColor}>{t(`${baseKey}.delta`)}</span>
                    <span className={`flex items-center gap-1 ${deltaColor}`}>
                      {statusToken.icon}
                      {t(`status.${item.status}`)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

