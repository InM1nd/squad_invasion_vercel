/**
 * Header Component
 * 
 * Displays the team logo and main title section at the top of the page.
 * Features a military-style tactical icon and team branding.
 */

import { Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="py-12 md:py-16">
      {/* Centered container for logo and title */}
      <div className="flex flex-col items-center justify-center gap-3">

        {/* Logo and title row */}
        <div className="flex items-center gap-3" data-testid="logo-section">
          {/* Team logo - Shield icon representing defense and teamwork */}
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary">
            <img
              src="/strategic_discord.jpg"
              alt="Strategic Discord"
              className="w-20 h-20 object-cover rounded-xl"
            />
          </div>

          {/* Team name heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            BÜRN
          </h1>
        </div>

        {/* Team tagline/description */}
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl text-center px-4">
          Elite Invasion Mode Specialists
        </p>
      </div>
    </header>
  );
}
