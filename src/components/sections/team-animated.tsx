"use client";

import { AnimateOnScroll } from "@/components/animations/animate-on-scroll";
import { TeamSection } from "./team";
import type { TeamMember } from "@/lib/types";

interface TeamSectionAnimatedProps {
  members: TeamMember[];
}

export function TeamSectionAnimated({ members }: TeamSectionAnimatedProps) {
  return (
    <AnimateOnScroll animation="fade-up" delay={300}>
      <TeamSection members={members} />
    </AnimateOnScroll>
  );
}

