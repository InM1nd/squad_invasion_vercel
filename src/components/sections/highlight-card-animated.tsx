"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Waves, Zap, ShieldCheck, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Waves,
  Zap,
  ShieldCheck,
};

interface HighlightCardAnimatedProps {
  id: string;
  label: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  iconName: string;
  accent?: "violet" | "cyan" | "amber";
  index: number;
}

const accentMap: Record<NonNullable<HighlightCardAnimatedProps["accent"]>, string> = {
  violet: "from-rose-500/15 via-rose-500/5 to-transparent",
  cyan: "from-cyan-400/20 via-cyan-400/5 to-transparent",
  amber: "from-amber-400/20 via-amber-400/5 to-transparent",
};

export function HighlightCardAnimated({
  label,
  title,
  description,
  metric,
  metricLabel,
  iconName,
  accent = "violet",
  index,
}: HighlightCardAnimatedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = iconMap[iconName] || Waves;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [index]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      )}
    >
      <Card className="relative overflow-hidden h-full border border-border/70 bg-card/90 backdrop-blur transition-all duration-500 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.02] group">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
            accentMap[accent]
          }`}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <Badge variant="outline" className="uppercase tracking-wide">
              {label}
            </Badge>
            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary/20">
              <Icon className="h-5 w-5 transition-transform duration-300" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
          <div className="pt-2">
            <p className="text-sm uppercase text-muted-foreground">
              {metricLabel}
            </p>
            <p className="text-2xl font-bold text-foreground">
              {metric}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

