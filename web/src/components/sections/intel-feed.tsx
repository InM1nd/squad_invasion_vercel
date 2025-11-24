import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface IntelItem {
  id: string;
  title: string;
  detail: string;
  value: string;
  delta: string;
  status: "up" | "steady" | "down";
  timestamp: string;
}

const statusConfig: Record<
  IntelItem["status"],
  { color: string; label: string; icon: ReactNode }
> = {
  up: {
    color: "text-emerald-500",
    label: "Рост",
    icon: <ArrowUpRight className="h-4 w-4" />,
  },
  down: {
    color: "text-rose-500",
    label: "Просадка",
    icon: <ArrowDownRight className="h-4 w-4" />,
  },
  steady: {
    color: "text-amber-500",
    label: "Стабильно",
    icon: <Activity className="h-4 w-4" />,
  },
};

interface IntelFeedSectionProps {
  intel: IntelItem[];
}

export function IntelFeedSection({ intel }: IntelFeedSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-3 mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Live Intel
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Брифинг оперативной обстановки
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Мгновенные сигналы о прогрессе клана: эффективность рейдов, фокус
            тренировок и уровень вовлеченности сообщества.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intel.map((item) => {
            const status = statusConfig[item.status];
            return (
              <Card
                key={item.id}
                className="p-6 h-full border border-border/70 bg-card/90 backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {item.timestamp}
                    </p>
                    <h3 className="text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                  <Badge variant="secondary">Online</Badge>
                </div>

                <div className="mt-6 flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-sm uppercase text-muted-foreground">
                      Показатель
                    </p>
                    <p className="text-4xl font-bold text-foreground">
                      {item.value}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <span className={status.color}>{item.delta}</span>
                    <span className={`flex items-center gap-1 ${status.color}`}>
                      {status.icon}
                      {status.label}
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

