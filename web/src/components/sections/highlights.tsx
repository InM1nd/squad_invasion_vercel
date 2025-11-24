import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface HighlightCardProps {
  id: string;
  label: string;
  title: string;
  description: string;
  metric: string;
  icon: LucideIcon;
  accent?: "violet" | "cyan" | "amber";
}

const accentMap: Record<NonNullable<HighlightCardProps["accent"]>, string> = {
  violet: "from-rose-500/15 via-rose-500/5 to-transparent",
  cyan: "from-cyan-400/20 via-cyan-400/5 to-transparent",
  amber: "from-amber-400/20 via-amber-400/5 to-transparent",
};

interface HighlightsSectionProps {
  cards: HighlightCardProps[];
}

export function HighlightsSection({ cards }: HighlightsSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-0 md:px-0">
        <div className="space-y-3 mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Field Report
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Почему BÜRN нельзя игнорировать
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Сводка ключевых арсенала и преимуществ, которые делают наше
            подразделение самым неудобным соперником в режиме Invasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className="relative overflow-hidden h-full border border-border/70 bg-card/90 backdrop-blur"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
                    accentMap[card.accent ?? "violet"]
                  }`}
                  aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col gap-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <Badge variant="outline" className="uppercase tracking-wide">
                      {card.label}
                    </Badge>
                    <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm uppercase text-muted-foreground">
                      Текущая метрика
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {card.metric}
                    </p>
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

