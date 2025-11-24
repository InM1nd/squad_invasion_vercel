import Image from "next/image";
import { ArrowUpRight, Radio, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

export async function HeroSection() {
  const [tHero, tCommon] = await Promise.all([
    getTranslations("hero"),
    getTranslations("common"),
  ]);

  const calloutKeys = [
    "callouts.first",
    "callouts.second",
    "callouts.third",
  ] as const;

  const callouts = calloutKeys.map((key) => tHero(key));

  const stats = [
    {
      label: tHero("stats.seasonRuns.label"),
      value: tHero("stats.seasonRuns.value"),
    },
    {
      label: tHero("stats.holdRate.label"),
      value: tHero("stats.holdRate.value"),
    },
    {
      label: tHero("stats.activePlayers.label"),
      value: tHero("stats.activePlayers.value"),
    },
  ];

  const glanceCards = [
    {
      label: tHero("glance.role.label"),
      value: tHero("glance.role.value"),
    },
    {
      label: tHero("glance.focus.label"),
      value: tHero("glance.focus.value"),
    },
    {
      label: tHero("glance.timezone.label"),
      value: tHero("glance.timezone.value"),
    },
  ];

  return (
    <section id="hero" className="py-12 md:py-16">
      <div className="relative overflow-hidden rounded-[32px] border bg-gradient-to-br from-zinc-50 via-white to-rose-50 text-zinc-900 dark:from-zinc-950 dark:via-black dark:to-zinc-900 group">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.15),_transparent_60%)]"
          aria-hidden="true"
        />
        <div className="absolute inset-y-0 right-0 w-1/2 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:24px_24px] mix-blend-screen" />
        </div>

        <div className="relative z-10 flex flex-col gap-10 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1 space-y-6">
              <Badge
                variant="secondary"
                className="bg-white/50 text-zinc-900 border-zinc-200 dark:bg-white/10 dark:text-white dark:border-white/20"
              >
                {tHero("badge")}
              </Badge>
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white">
                  {tHero("title")}
                </h1>
                <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">
                  {tHero("description")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {callouts.map((callout, index) => (
                  <span
                    key={callout}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-4 py-2 text-sm text-zinc-700 dark:border-white/20 dark:bg-white/10 dark:text-white/80 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-primary/40"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                    {callout}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" className="gap-2" asChild>
                  <a href="https://discord.gg/9w4N777V" target="_blank" rel="noreferrer">
                    {tCommon("cta_join")}
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-zinc-200 text-zinc-900 hover:bg-zinc-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                  asChild
                >
                  <a href="https://twitch.tv" target="_blank" rel="noreferrer">
                    {tCommon("cta_watch")}
                    <Radio className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex-shrink-0 w-full lg:w-72 xl:w-80">
              <div className="relative">
                <div className="absolute inset-0 bg-rose-200/40 dark:bg-rose-500/30 blur-3xl transition-all duration-500 group-hover:bg-rose-300/50 dark:group-hover:bg-rose-500/40" />
                <div className="relative rounded-3xl border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-rose-500/20">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/30 shadow-lg">
                      <Image
                        src="/strategic_discord.jpg"
                        alt="Strategic Discord"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm uppercase text-zinc-500 dark:text-white/60">Callsign</p>
                      <p className="text-3xl font-semibold tracking-[0.2em] text-zinc-900 dark:text-white">BÜRN</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex items-center justify-between text-sm uppercase tracking-wide text-zinc-500 dark:text-white/60"
                      >
                        <span>{stat.label}</span>
                        <span className="text-xl font-semibold text-zinc-900 dark:text-white">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-zinc-600 dark:text-white/70">
            {glanceCards.map((item, index) => (
              <div
                key={item.label}
                className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/40 hover:bg-white/90 dark:hover:bg-white/10"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <p className="text-sm uppercase text-zinc-500 dark:text-white/60">{item.label}</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
