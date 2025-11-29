import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { ThemeProvider } from "@/components/theme-provider";
import { LandingHeader } from "@/components/landing-header";
import { routing } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-dynamic';

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
    { href: "/roadmap" as const, label: tNav("roadmap") },
    { href: "/rules" as const, label: tNav("rules") },
  ];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-background text-foreground">
          <LandingHeader navLinks={navLinks} />
          <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">{children}</main>
        </div>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

