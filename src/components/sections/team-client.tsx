"use client";

import { TeamMemberAnimated } from "./team-member-animated";
import type { TeamMember } from "@/lib/types";
import { useTranslations } from "next-intl";

interface TeamSectionClientProps {
  members: TeamMember[];
}

export function TeamSectionClient({ members }: TeamSectionClientProps) {
  const t = useTranslations("team");

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
            {members.map((member, index) => {
              const baseKey = member.translationKey;
              return (
                <TeamMemberAnimated
                  key={member.id}
                  id={member.id}
                  name={t(`${baseKey}.name`)}
                  role={t(`${baseKey}.role`)}
                  bio={t(`${baseKey}.bio`)}
                  initials={member.initials}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeamSectionClient;