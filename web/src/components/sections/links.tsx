import { Button } from "@/components/ui/button";
import type { SocialLink } from "@/lib/types";
import {
  SiDiscord,
  SiInstagram,
  SiSteam,
  SiTwitch,
  SiYoutube,
} from "react-icons/si";
import { Twitter } from "lucide-react";

const iconMap = {
  twitch: SiTwitch,
  youtube: SiYoutube,
  x: Twitter,
  instagram: SiInstagram,
  discord: SiDiscord,
  steam: SiSteam,
};

interface LinksSectionProps {
  links: SocialLink[];
}

export function LinksSection({ links }: LinksSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-3 mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            Follow Our Operations
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Где следить за BÜRN
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Стримы, клипы и бардак в чате — всё в одном месте.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {links.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <Button
                key={link.id}
                variant="outline"
                size="icon"
                className="rounded-lg"
                asChild
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${link.labelKey} page`}
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

