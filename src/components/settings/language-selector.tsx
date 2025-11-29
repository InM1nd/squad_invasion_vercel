"use client";

import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/i18n/locales";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("dashboard.settings");

  const handleLanguageChange = (value: string) => {
    router.push(pathname, { locale: value });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Languages className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("language.title")}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{t("language.description")}</p>
      <div className="flex flex-wrap gap-2">
        {locales.map((value) => {
          const isActive = value === locale;
          return (
            <Button
              key={value}
              variant={isActive ? "default" : "outline"}
              onClick={() => handleLanguageChange(value)}
              className={cn(
                "min-w-[80px]",
                isActive && "bg-primary text-primary-foreground"
              )}
            >
              {value.toUpperCase()}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

