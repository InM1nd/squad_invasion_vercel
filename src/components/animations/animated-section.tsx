"use client";

import { type ReactNode } from "react";
import { AnimateOnScroll } from "./animate-on-scroll";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  staggerDelay?: number;
}

export function AnimatedSection({
  children,
  className,
  stagger = false,
  staggerDelay = 100,
}: AnimatedSectionProps) {
  if (!stagger) {
    return (
      <AnimateOnScroll animation="fade-up" className={className}>
        {children}
      </AnimateOnScroll>
    );
  }

  // For staggered animations, wrap each child
  const childrenArray = Array.isArray(children) ? children : [children];
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <AnimateOnScroll
          key={index}
          animation="fade-up"
          delay={index * staggerDelay}
        >
          {child}
        </AnimateOnScroll>
      ))}
    </div>
  );
}

