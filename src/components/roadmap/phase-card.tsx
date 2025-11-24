"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Settings,
  Rocket,
  Users,
  Target,
  Trophy,
  MessageSquare,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Settings,
  Rocket,
  Users,
  Target,
  Trophy,
  MessageSquare,
  Zap,
};

interface PhaseCardProps {
  phaseKey: string;
  title: string;
  duration: string;
  description: string;
  features: string[];
  iconName: string;
  color: string;
  index: number;
  isCompleted: boolean;
  completedLabel: string;
  featuresLabel: string;
}

export function PhaseCard({
  phaseKey,
  title,
  duration,
  description,
  features,
  iconName,
  color,
  index,
  isCompleted,
  completedLabel,
  featuresLabel,
}: PhaseCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconMap[iconName] || Settings;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="group relative overflow-hidden border border-border/70 bg-card/50 backdrop-blur-sm hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div
                className={cn(
                  "relative flex items-center justify-center w-20 h-20 rounded-2xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500",
                  color
                )}
              >
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Icon className="relative h-10 w-10 z-10" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-5">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {title}
                      </h3>
                      {isCompleted && (
                        <Badge
                          variant="secondary"
                          className="gap-1.5 animate-in fade-in slide-in-from-right-4 duration-500"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {completedLabel}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-1.5 w-12 rounded-full transition-all duration-500 group-hover:w-16",
                          color
                        )}
                      />
                      <p className="text-sm font-medium text-muted-foreground">
                        {duration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                {description}
              </p>

              {/* Features */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-foreground/60 uppercase tracking-[0.3em]">
                  {featuresLabel}
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300"
                      style={{
                        animationDelay: `${(index * 100) + (idx * 50)}ms`,
                      }}
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 transition-all duration-300 group-hover:scale-150",
                          color
                        )}
                      />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div
          className={cn(
            "absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none rounded-bl-full",
            color === "bg-slate-500" && "bg-gradient-to-br from-slate-500 to-transparent",
            color === "bg-blue-500" && "bg-gradient-to-br from-blue-500 to-transparent",
            color === "bg-purple-500" && "bg-gradient-to-br from-purple-500 to-transparent",
            color === "bg-green-500" && "bg-gradient-to-br from-green-500 to-transparent",
            color === "bg-amber-500" && "bg-gradient-to-br from-amber-500 to-transparent",
            color === "bg-cyan-500" && "bg-gradient-to-br from-cyan-500 to-transparent",
            color === "bg-rose-500" && "bg-gradient-to-br from-rose-500 to-transparent"
          )}
        />
      </Card>
    </div>
  );
}

