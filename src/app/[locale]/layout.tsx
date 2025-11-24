import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { Flame } from "lucide-react";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: rawLocale } = await params;
  if (!(routing.locales as readonly string[]).includes(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as (typeof routing.locales)[number];

  setRequestLocale(locale);
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const tNav = await getTranslations({ locale, namespace: "navMenu" });

  const navLinks = [
    { href: "#highlights", label: tNav("highlights"), type: "anchor" as const },
    { href: "#events", label: tNav("events"), type: "anchor" as const },
    { href: "#gallery", label: tNav("gallery"), type: "anchor" as const },
    { href: "#schedule", label: tNav("schedule"), type: "anchor" as const },
    { href: "#contact", label: tNav("contact"), type: "anchor" as const },
    { href: "/rules", label: tNav("rules"), type: "route" as const },
  ];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm uppercase tracking-[0.4em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Flame className="h-4 w-4 text-primary" />
                <span>BÜRN</span>
              </Link>
              <nav className="hidden items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-muted-foreground md:flex">
                {navLinks.map((item) =>
                  item.type === "anchor" ? (
                    <a
                      key={item.href}
                      href={item.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>
              <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

