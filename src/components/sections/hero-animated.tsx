"use client";

import { AnimateOnScroll } from "@/components/animations/animate-on-scroll";
import { HeroSection } from "./hero";

export function HeroSectionAnimated() {
  return (
    <AnimateOnScroll animation="fade-in" delay={0}>
      <HeroSection />
    </AnimateOnScroll>
  );
}

