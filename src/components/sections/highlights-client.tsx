"use client";

import { HighlightCardAnimated } from "./highlight-card-animated";
import type { HighlightCardProps } from "./highlights";
import { useTranslations } from "next-intl";

interface HighlightsSectionClientProps {
  cards: HighlightCardProps[];
}

export function HighlightsSectionClient({ cards }: HighlightsSectionClientProps) {
  const t = useTranslations("highlights");

  return (
    <section id="highlights" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-0 md:px-0">
        <div className="space-y-3 mb-12 text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const baseKey = `${card.translationKey}`;
            return (
              <HighlightCardAnimated
                key={card.id}
                id={card.id}
                label={t(`${baseKey}.label`)}
                title={t(`${baseKey}.title`)}
                description={t(`${baseKey}.description`)}
                metric={t(`${baseKey}.metric`)}
                metricLabel={t("metricLabel")}
                iconName={card.iconName}
                accent={card.accent}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

