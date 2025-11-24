import { HeroSection } from "@/components/sections/hero";
import { HighlightsSectionClient } from "@/components/sections/highlights-client";
import { TeamSectionClient } from "@/components/sections/team-client";
import { EventsSection } from "@/components/sections/events";
import { IntelFeedSection } from "@/components/sections/intel-feed";
import { ContactSection } from "@/components/sections/contact";
import { LinksSection } from "@/components/sections/links";
import { GallerySection } from "@/components/sections/gallery";
import { ScheduleSection } from "@/components/sections/schedule";
import { SectionWrapper } from "@/components/sections/section-wrapper";
import {
  contactInfo,
  highlightCards,
  intelFeed,
  scheduleBlocks,
  socialLinks,
  teamMembers,
  galleryCards,
} from "@/data/home";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Flame } from "lucide-react";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as (typeof routing.locales)[number];
  setRequestLocale(locale);
  
  const tCommon = await getTranslations("common");

  return (
    <div className="space-y-8">
      <SectionWrapper delay={0} animation="fade-in">
        <HeroSection />
      </SectionWrapper>
      
      <SectionWrapper delay={100} animation="fade-up">
        <HighlightsSectionClient cards={highlightCards} />
      </SectionWrapper>
      
      <SectionWrapper delay={200} animation="fade-up">
        <TeamSectionClient members={teamMembers} />
      </SectionWrapper>
      
      <SectionWrapper delay={300} animation="fade-up">
        <EventsSection />
      </SectionWrapper>
      
      <GallerySection items={galleryCards} />
      
      <SectionWrapper delay={500} animation="fade-up">
        <ScheduleSection blocks={scheduleBlocks} />
      </SectionWrapper>
      
      <SectionWrapper delay={600} animation="fade-up">
        <IntelFeedSection intel={intelFeed} />
      </SectionWrapper>
      
      <SectionWrapper delay={700} animation="fade-up">
        <ContactSection contact={contactInfo} />
      </SectionWrapper>
      
      <SectionWrapper delay={800} animation="fade-up">
        <LinksSection links={socialLinks} />
      </SectionWrapper>
      
      <SectionWrapper delay={900} animation="fade-up">
        <footer className="py-12 border-t border-border/50">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.4em] text-muted-foreground">
              <Flame className="h-4 w-4 text-primary" />
              <span>BÜRN</span>
            </div>
            <p className="text-sm text-muted-foreground">{tCommon("footer")}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
              <span>© 2025</span>
              <span>•</span>
              <span>Task Force</span>
            </div>
          </div>
        </footer>
      </SectionWrapper>
    </div>
  );
}

