"use client";

import { usePathname } from "@/i18n/navigation";
import { AuthButton } from "@/components/auth/auth-button";
import { MobileMenu } from "@/components/mobile-menu";
import { DesktopMenu } from "@/components/desktop-menu";
import { Link } from "@/i18n/navigation";
import { Flame } from "lucide-react";

interface LandingHeaderProps {
  navLinks: Array<{ href: string; label: string }>;
}

export function LandingHeader({ navLinks }: LandingHeaderProps) {
  const pathname = usePathname();
  
  // Don't show header on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 text-xs sm:text-sm lg:text-base font-medium uppercase tracking-[0.4em] text-foreground transition-all duration-200 hover:text-primary hover:scale-105"
          >
            <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary transition-transform duration-200 hover:rotate-12" />
            <span className="font-semibold">BÜRN</span>
          </Link>
          <MobileMenu navLinks={navLinks} />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 shrink-0">
          <AuthButton />
          <DesktopMenu navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}

