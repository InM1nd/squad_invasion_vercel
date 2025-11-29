"use client";

import { useState } from "react";
import { Menu, Languages, Moon, Sun, Monitor, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { locales } from "@/i18n/locales";
import { cn } from "@/lib/utils";

interface DesktopMenuProps {
  navLinks: Array<{ href: string; label: string }>;
}

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function DesktopMenu({ navLinks }: DesktopMenuProps) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const t = useTranslations("nav");

  const handleLanguageChange = (value: string) => {
    router.push(pathname, { locale: value });
    setOpen(false);
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="hidden md:flex"
        onClick={() => setOpen(true)}
        aria-label="Menu"
      >
        <Menu className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Menu</span>
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] lg:w-[480px] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-6 pt-8 pb-6 border-b">
              <SheetTitle className="text-2xl font-bold">Меню</SheetTitle>
              <SheetDescription className="text-base">
                Навигация и настройки
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {/* Navigation Links */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Навигация
                </h3>
                <nav className="space-y-1">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href as any}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between group px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Language Selection */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("language")}
                  </h3>
                </div>
                <div className="space-y-1">
                  {locales.map((value) => {
                    const isActive = value === locale;
                    return (
                      <button
                        key={value}
                        onClick={() => handleLanguageChange(value)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <span>{value.toUpperCase()}</span>
                        {isActive && (
                          <div className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Selection */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("theme")}
                  </h3>
                </div>
                <div className="space-y-1">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = (theme || "system") === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="flex-1 text-left">{option.label}</span>
                        {isActive && (
                          <div className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

