"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TeamMemberAnimatedProps {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  index: number;
}

export function TeamMemberAnimated({
  name,
  role,
  bio,
  initials,
  index,
}: TeamMemberAnimatedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      <Card className="p-6 h-full border border-border/60 bg-background/80 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-20 w-20 shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/40">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              {name}
            </h3>
            <Badge variant="secondary" className="uppercase tracking-wide">
              {role}
            </Badge>
          </div>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {bio}
          </p>
        </div>
      </Card>
    </div>
  );
}

