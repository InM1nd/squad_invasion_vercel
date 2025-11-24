import { HeroSection } from "@/components/sections/hero";
import { HighlightsSection } from "@/components/sections/highlights";
import { TeamSection } from "@/components/sections/team";
import { EventsSection } from "@/components/sections/events";
import { IntelFeedSection } from "@/components/sections/intel-feed";
import { ContactSection } from "@/components/sections/contact";
import { LinksSection } from "@/components/sections/links";
import { GallerySection } from "@/components/sections/gallery";
import { ScheduleSection } from "@/components/sections/schedule";
import {
  contactInfo,
  highlightCards,
  intelFeed,
  scheduleBlocks,
  socialLinks,
  teamMembers,
  galleryCards,
} from "@/data/home";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const tCommon = await getTranslations("common");

  return (
    <div className="space-y-8">
      <HeroSection />
      <HighlightsSection cards={highlightCards} />
      <TeamSection members={teamMembers} />
      <EventsSection />
      <GallerySection items={galleryCards} />
      <ScheduleSection blocks={scheduleBlocks} />
      <IntelFeedSection intel={intelFeed} />
      <ContactSection contact={contactInfo} />
      <LinksSection links={socialLinks} />
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>{tCommon("footer")}</p>
      </footer>
    </div>
  );
}

