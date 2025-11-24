"use client";

import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { GalleryItem } from "@/lib/types";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import TargetCursor from "@/components/ui/target-cursor";

const accentBadge: Record<GalleryItem["accent"], string> = {
  rose: "bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-100 dark:border-rose-500/30",
  violet: "bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-500/10 dark:text-violet-100 dark:border-violet-500/30",
  cyan: "bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-100 dark:border-cyan-400/30",
};

interface GallerySectionProps {
  items: GalleryItem[];
}

export function GallerySection({ items }: GallerySectionProps) {
  const t = useTranslations("gallery");
  const safeItems = useMemo(
    () =>
      items.length
        ? items
        : [
            {
              id: "placeholder",
              translationKey: "cards.harju",
              accent: "rose" as const,
            },
          ],
    [items],
  );

  const [activeId, setActiveId] = useState(safeItems[0].id);
  const [cursorActive, setCursorActive] = useState(false);

  const activeItem =
    safeItems.find((card) => card.id === activeId) ?? safeItems[0];
  const activeKey = activeItem.translationKey;

  const gridCells = useMemo(() => {
    const base = new Array(12).fill(null) as Array<GalleryItem | null>;
    safeItems.forEach((item, index) => {
      base[index] = item;
    });
    return base;
  }, [safeItems]);

  const handleSelect = useCallback((id: string) => setActiveId(id), []);

  return (
    <section id="gallery" className="py-12 md:py-16">
      {cursorActive ? (
        <TargetCursor
          targetSelector=".gallery-target"
          spinDuration={3}
          hoverDuration={0.3}
          hideDefaultCursor
        />
      ) : null}
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col gap-6 text-left">
          <div className="space-y-3 md:self-start">
            <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t("title")}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                {t("description")}
              </p>
            </div>
          </div>
          <Button asChild size="lg" className="self-start">
            <a href="https://discord.gg/9w4N777V" target="_blank" rel="noreferrer">
              {t("cta")}
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
          <div className="rounded-[32px] border bg-card/90 p-6 shadow-lg space-y-6">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {t("snapshot.title")}
              </p>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {t(`${activeKey}.subtitle`)}
                    </p>
                    <h3 className="text-3xl font-semibold text-foreground">
                      {t(`${activeKey}.title`)}
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {t(`${activeKey}.description`)}
                  </p>
                  <div className="grid gap-4 pt-2 sm:grid-cols-3">
                    <div className="rounded-2xl border bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("snapshot.mode")}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {t(`${activeKey}.mode`)}
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("snapshot.map")}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {t(`${activeKey}.map`)}
                      </p>
                    </div>
                    <div className="rounded-2xl border bg-background/60 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("snapshot.result")}
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {t(`${activeKey}.result`)}
                      </p>
                    </div>
                  </div>
                </div>

                <GalleryMediaSlider
                  title={t("media.title")}
                  hint={t("media.hint")}
                  placeholder={t("media.placeholder")}
                />
              </div>
            </div>
          </div>

          <div
            className="relative rounded-[36px] border bg-muted/20 p-6 shadow-inner"
            onMouseEnter={() => setCursorActive(true)}
            onMouseLeave={() => setCursorActive(false)}
          >
            <div className="grid grid-cols-4 grid-rows-3 gap-3">
              {gridCells.map((cell, index) => {
                const isActive = cell?.id === activeItem.id;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => cell && handleSelect(cell.id)}
                    onKeyDown={(event) => {
                      if (!cell) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSelect(cell.id);
                      }
                    }}
                    className={cn(
                      "gallery-target relative flex h-24 flex-col items-start justify-between rounded-2xl border bg-background/70 p-3 text-left transition-all",
                      cell
                        ? isActive
                          ? "border-primary/70 shadow-lg ring-2 ring-primary/30"
                          : "border-border/60 hover:border-primary/30"
                        : "border-dashed border-border/50 text-muted-foreground",
                    )}
                    tabIndex={cell ? 0 : -1}
                  >
                    {cell ? (
                      <>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                            accentBadge[cell.accent],
                          )}
                        >
                          {t(`${cell.translationKey}.map`)}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {t(`${cell.translationKey}.result`)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-medium opacity-60">
                        {t("placeholder")}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

interface GalleryMediaSliderProps {
  title: string;
  hint: string;
  placeholder: string;
}

function GalleryMediaSlider({
  title,
  hint,
  placeholder,
}: GalleryMediaSliderProps) {
  const [index, setIndex] = useState(0);
  const slides = [
    { src: "/strategic_discord.jpg", alt: "Placeholder 1" },
    { src: "/strategic_discord.jpg", alt: "Placeholder 2" },
    { src: "/strategic_discord.jpg", alt: "Placeholder 3" },
  ];

  const prev = () =>
    setIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  const next = () =>
    setIndex((current) => (current === slides.length - 1 ? 0 : current + 1));

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between text-muted-foreground">
        <p className="text-xs uppercase tracking-[0.3em]">{title}</p>
        <span className="text-[10px] uppercase tracking-[0.3em]">{hint}</span>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted">
        <Image
          key={slides[index].alt}
          src={slides[index].src}
          alt={slides[index].alt}
          width={640}
          height={360}
          className="h-52 w-full object-cover"
        />
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-xl bg-black/60 px-3 py-2 text-[11px] font-medium text-white/90">
          <span>{placeholder}</span>
          <span>
            {index + 1}/{slides.length}
          </span>
        </div>
        <button
          type="button"
          onClick={prev}
          className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-lg transition hover:bg-black/70"
          aria-label="Previous media"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-lg transition hover:bg-black/70"
          aria-label="Next media"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
