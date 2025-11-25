"use client";

import { Flame } from "lucide-react";

export function AuthLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated flame loader */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <Flame className="h-16 w-16 text-primary opacity-20" />
          </div>
          <div className="relative animate-pulse">
            <Flame className="h-16 w-16 text-primary" />
          </div>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>

        {/* Text */}
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Authenticating...
        </p>
      </div>
    </div>
  );
}

