"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  navLinks: Array<{ href: string; label: string }>;
}

export function MobileMenu({ navLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "fixed top-[57px] left-0 right-0 z-50 border-b bg-background md:hidden",
              "animate-in slide-in-from-top-2"
            )}
          >
            <nav className="flex flex-col px-6 py-4 gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href={item.href as any}
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground transition-colors hover:text-foreground py-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

