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
import { getTranslations } from "next-intl/server";

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

export async function LinksSection({ links }: LinksSectionProps) {
  const t = await getTranslations("links");

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-3 mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {links.map((link) => {
            const Icon = iconMap[link.icon];
            const label = t(link.labelKey as any);
            return (
              <Button
                key={link.id}
                variant="outline"
                size="icon"
                className="rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/40 group relative overflow-hidden"
                asChild
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/10 transition-all duration-300" />
                  <Icon className="h-6 w-6 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
