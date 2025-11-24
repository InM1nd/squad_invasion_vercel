"use client";

import { AnimateOnScroll } from "@/components/animations/animate-on-scroll";
import { HighlightsSection } from "./highlights";
import type { HighlightCardProps } from "./highlights";

interface HighlightsSectionAnimatedProps {
  cards: HighlightCardProps[];
}

export function HighlightsSectionAnimated({ cards }: HighlightsSectionAnimatedProps) {
  return (
    <AnimateOnScroll animation="fade-up" delay={200}>
      <HighlightsSection cards={cards} />
    </AnimateOnScroll>
  );
}

