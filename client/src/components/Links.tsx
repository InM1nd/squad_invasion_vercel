/**
 * Links Component
 * 
 * Displays social media and streaming platform links.
 * Features platform-specific icons in a horizontal layout.
 * Includes gaming platforms like Twitch, YouTube, Discord, etc.
 */

import { Button } from "@/components/ui/button";
import type { SocialLink } from "@shared/schema";
import { SiTwitch, SiYoutube, SiInstagram, SiDiscord, SiSteam } from "react-icons/si";
import { Twitter } from "lucide-react";

interface LinksProps {
  links: SocialLink[];
}

/**
 * Icon mapping for different social platforms
 * Uses react-icons for brand icons and lucide-react for generic icons
 */
const iconMap = {
  twitch: SiTwitch,
  youtube: SiYoutube,
  x: Twitter,
  instagram: SiInstagram,
  discord: SiDiscord,
  steam: SiSteam,
};

export default function Links({ links }: LinksProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Section header */}
        <div className="space-y-3 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="section-links-title">
            Follow Our Operations
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Watch our streams and connect on social platforms
          </p>
        </div>

        {/* Platform icons in horizontal centered layout */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {links.map((link) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap];
            return (
              <Button
                key={link.id}
                variant="outline"
                size="icon"
                className="rounded-lg"
                asChild
                data-testid={`button-social-${link.name.toLowerCase()}`}
              >
                {/* External link to platform */}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${link.name} page`}
                >
                  <Icon className="h-6 w-6" />
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
