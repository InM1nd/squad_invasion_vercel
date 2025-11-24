import { HeroSection } from "@/components/sections/hero";
import { HighlightsSection } from "@/components/sections/highlights";
import { TeamSection } from "@/components/sections/team";
import { EventsSection } from "@/components/sections/events";
import { IntelFeedSection } from "@/components/sections/intel-feed";
import { ContactSection } from "@/components/sections/contact";
import { LinksSection } from "@/components/sections/links";
import {
  contactInfo,
  highlightCards,
  intelFeed,
  socialLinks,
  teamMembers,
} from "@/data/home";

export default function Page() {
  return (
    <div className="space-y-10">
      <HeroSection />
      <HighlightsSection cards={highlightCards} />
      <TeamSection members={teamMembers} />
      <EventsSection />
      <IntelFeedSection intel={intelFeed} />
      <ContactSection contact={contactInfo} />
      <LinksSection links={socialLinks} />
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Штаб Наслаждений.</p>
      </footer>
    </div>
  );
}

