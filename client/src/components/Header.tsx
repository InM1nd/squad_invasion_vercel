/**
 * Header Component
 * 
 * Displays the team logo and main title section at the top of the page.
 * Features a military-style tactical icon and team branding.
 */

import { ArrowUpRight, Radio, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
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

  return (
    <header className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[32px] border bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsla(280,80%,60%,0.2),_transparent_55%)]"
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 w-1/2 opacity-60">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:24px_24px] mix-blend-screen" />
          </div>

          <div className="relative z-10 p-8 md:p-12 flex flex-col gap-10">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-1 space-y-6">
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-white border-white/20"
                >
                  Season VII // Invasion Command
                </Badge>
                <div className="flex flex-col gap-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                    BÜRN — штурмовой отряд с температурой плазмы
                  </h1>
                  <p className="text-base md:text-lg text-white/70 max-w-2xl">
                    Мы заходим в Invasion без шансов для противоположной стороны:
                    мгновенная разведка, агрессивный пуш и хирургическая защита
                    точек. Всё подаётся с приправой дисциплины и мемов.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {callouts.map((callout) => (
                    <span
                      key={callout}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80"
                    >
                      <Sparkles className="h-4 w-4" />
                      {callout}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Button
                    size="lg"
                    className="gap-2 bg-white text-black hover:bg-white/90"
                    asChild
                  >
                    <a
                      href="https://discord.gg/9w4N777V"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Вступить в штаб
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-white/30 text-white hover:bg-white/10"
                    asChild
                  >
                    <a
                      href="https://twitch.tv"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Смотреть стрим
                      <Radio className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex-shrink-0 w-full lg:w-72 xl:w-80">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/40 blur-3xl" />
                  <div className="relative rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-2xl overflow-hidden border border-white/10">
                        <img
                          src="/strategic_discord.jpg"
                          alt="Strategic Discord"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm uppercase text-white/60">
                          Callsign
                        </p>
                        <p className="text-3xl font-semibold tracking-[0.2em]">
                          BÜRN
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex items-center justify-between text-sm uppercase tracking-wide text-white/60"
                        >
                          <span>{stat.label}</span>
                          <span className="text-xl font-semibold text-white">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm uppercase text-white/60">Роль</p>
                <p className="text-lg font-semibold text-white">
                  Anti-meta raid unit
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm uppercase text-white/60">Фокус</p>
                <p className="text-lg font-semibold text-white">
                  Блиц-взлом точек, eco disruption
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm uppercase text-white/60">Сетка</p>
                <p className="text-lg font-semibold text-white">
                  EU prime / Late NA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
