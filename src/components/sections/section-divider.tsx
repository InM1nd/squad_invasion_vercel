"use client";

import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  variant?: "default" | "gradient" | "dots";
}

export function SectionDivider({ 
  className,
  variant = "default" 
}: SectionDividerProps) {
  if (variant === "dots") {
    return (
      <div className={cn("flex justify-center py-8", className)}>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className={cn("py-8", className)}>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>
    );
  }

  return (
    <div className={cn("py-8", className)}>
      <div className="h-px w-full bg-border/50" />
    </div>
  );
}

