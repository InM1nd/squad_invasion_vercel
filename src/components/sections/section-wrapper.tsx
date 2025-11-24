"use client";

import { AnimateOnScroll } from "@/components/animations/animate-on-scroll";
import type { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  delay?: number;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale";
}

export function SectionWrapper({
  children,
  delay = 0,
  animation = "fade-up",
}: SectionWrapperProps) {
  return (
    <AnimateOnScroll delay={delay} animation={animation}>
      {children}
    </AnimateOnScroll>
  );
}

