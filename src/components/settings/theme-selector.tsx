"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("dashboard.settings");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Moon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("theme.title")}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{t("theme.description")}</p>
      <div className="flex flex-wrap gap-2">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = (theme || "system") === option.value;
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-2 min-w-[120px]",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

