import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import {
  CheckCircle2,
  Headphones,
  Shield,
  Users,
  Video,
  MessageSquare,
  CalendarDays,
  FileText,
} from "lucide-react";

const stepKeys = ["brief", "setup", "play", "followup"] as const;

const requirementItems = [
  { key: "comms", icon: Headphones },
  { key: "roster", icon: Users },
  { key: "fair", icon: Shield },
  { key: "broadcast", icon: Video },
] as const;

const faqKeys = ["calendar", "modes", "observers"] as const;

export default async function RulesPage() {
  const t = await getTranslations("rulesPage");
  const calendarId = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
  const calendarHref = calendarId
    ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}`
    : "https://calendar.google.com";

  return (
    <div className="space-y-12 pb-10">
      <section className="rounded-[36px] border bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-10 text-white shadow-2xl">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/70">
            {t("hero.badge")}
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">
              {t("hero.eyebrow")}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t("hero.title")}
            </h1>
            <p className="text-base md:text-lg text-white/80">
              {t("hero.description")}
            </p>
            <p className="text-sm text-white/60">{t("hero.note")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2" asChild>
              <a href="https://discord.gg/9w4N777V" target="_blank" rel="noreferrer">
                <MessageSquare className="h-4 w-4" />
                {t("hero.cta_discord")}
              </a>
            </Button>
            <Button size="lg" variant="secondary" className="gap-2" asChild>
              <a href={calendarHref} target="_blank" rel="noreferrer">
                <CalendarDays className="h-4 w-4" />
                {t("hero.cta_calendar")}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {t("steps.title")}
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            {t("steps.title")}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {stepKeys.map((key, index) => (
            <Card key={key} className="p-6 space-y-3 border border-border/70">
              <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {index + 1}
                </span>
                {t("hero.eyebrow")}
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {t(`steps.items.${key}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`steps.items.${key}.description`)}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {t("requirements.title")}
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            {t("requirements.title")}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {requirementItems.map(({ key, icon: Icon }) => (
            <Card key={key} className="flex flex-col gap-4 border border-border/70 p-6">
              <div className="flex items-center gap-3 text-primary">
                <Icon className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.3em]">
                  {t(`requirements.items.${key}.title`)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {t(`requirements.items.${key}.description`)}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {t("faq.title")}
          </p>
        </div>
        <div className="space-y-4">
          {faqKeys.map((key) => (
            <Card key={key} className="space-y-3 border border-border/70 p-5">
              <div className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-semibold">
                  {t(`faq.items.${key}.question`)}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t(`faq.items.${key}.answer`)}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border bg-card/90 p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">
              {t("hero.cta_discord")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("hero.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="gap-2" asChild>
              <a href="https://discord.gg/9w4N777V" target="_blank" rel="noreferrer">
                <MessageSquare className="h-4 w-4" />
                {t("hero.cta_discord")}
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href={calendarHref} target="_blank" rel="noreferrer">
                <CalendarDays className="h-4 w-4" />
                {t("hero.cta_calendar")}
              </a>
            </Button>
            <Button variant="ghost" className="gap-2" asChild>
              <a href="https://docs.google.com/document/d/rules" target="_blank" rel="noreferrer">
                <FileText className="h-4 w-4" />
                {t("hero.cta_doc")}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

