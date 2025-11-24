import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export interface IntelItem {
  id: string;
  title: string;
  detail: string;
  value: string;
  delta: string;
  status: "up" | "steady" | "down";
  timestamp: string;
}

interface IntelFeedProps {
  intel: IntelItem[];
}

const statusConfig: Record<
  IntelItem["status"],
  { color: string; icon: ReactNode; label: string }
> = {
  up: {
    color: "text-emerald-500",
    icon: <ArrowUpRight className="h-4 w-4" />,
    label: "Рост",
  },
  down: {
    color: "text-rose-500",
    icon: <ArrowDownRight className="h-4 w-4" />,
    label: "Просадка",
  },
  steady: {
    color: "text-amber-500",
    icon: <Activity className="h-4 w-4" />,
    label: "Стабильно",
  },
};

export default function IntelFeed({ intel }: IntelFeedProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
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
                className="p-6 h-full border border-border/70 bg-card/80 backdrop-blur"
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

