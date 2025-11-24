import Image from "next/image";
import { ArrowUpRight, Radio, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Вторжения за сезон", value: "142+" },
  { label: "Процент удержания точек", value: "87%" },
  { label: "Активные бойцы", value: "32" },
];

const callouts = [
  "Мультиклановый саппорт",
  "Тактический штаб 24/7",
  "Гибкие тренировочные ячейки",
];

export function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="relative overflow-hidden rounded-[32px] border bg-gradient-to-br from-zinc-50 via-white to-rose-50 text-zinc-900 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
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
                Season VII // Invasion Command
              </Badge>
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  BÜRN — штурмовой отряд с температурой плазмы
                </h1>
                <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">
                  Мы заходим в Invasion без шансов для противоположной стороны:
                  мгновенная разведка, агрессивный пуш и хирургическая защита
                  точек. Всё подаётся с приправой дисциплины и мемов.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {callouts.map((callout) => (
                  <span
                    key={callout}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-4 py-2 text-sm text-zinc-700 dark:border-white/20 dark:bg-white/10 dark:text-white/80"
                  >
                    <Sparkles className="h-4 w-4" />
                    {callout}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" className="gap-2" asChild>
                  <a href="https://discord.gg/9w4N777V" target="_blank" rel="noreferrer">
                    Вступить в штаб
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
                    Смотреть стрим
                    <Radio className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex-shrink-0 w-full lg:w-72 xl:w-80">
              <div className="relative">
                <div className="absolute inset-0 bg-rose-200/40 dark:bg-rose-500/30 blur-3xl" />
                <div className="relative rounded-3xl border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
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
                      <p className="text-sm uppercase text-zinc-500 dark:text-white/60">
                        Callsign
                      </p>
                      <p className="text-3xl font-semibold tracking-[0.2em] text-zinc-900 dark:text-white">
                        BÜRN
                      </p>
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
            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="text-sm uppercase text-zinc-500 dark:text-white/60">
                Роль
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                Anti-meta raid unit
              </p>
            </div>
            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="text-sm uppercase text-zinc-500 dark:text-white/60">
                Фокус
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                Блиц-взлом точек, eco disruption
              </p>
            </div>
            <div className="rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="text-sm uppercase text-zinc-500 dark:text-white/60">
                Сетка
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                EU prime / Late NA
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

