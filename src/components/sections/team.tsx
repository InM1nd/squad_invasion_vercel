import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TeamMember } from "@/lib/types";
import { getTranslations } from "next-intl/server";

interface TeamSectionProps {
  members: TeamMember[];
}

export async function TeamSection({ members }: TeamSectionProps) {
  const t = await getTranslations("team");

  return (
    <section id="team" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-3 mb-12 text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
            {t("description")}
          </p>
        </div>

        <div className="rounded-[32px] border bg-muted/30 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-6">
            {members.map((member) => {
              const baseKey = member.translationKey;
              return (
                <Card
                  key={member.id}
                  className="p-6 h-full border border-border/60 bg-background/80 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-20 w-20 shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/40">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-semibold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {t(`${baseKey}.name`)}
                      </h3>
                      <Badge variant="secondary" className="uppercase tracking-wide">
                        {t(`${baseKey}.role`)}
                      </Badge>
                    </div>

                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {t(`${baseKey}.bio`)}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

