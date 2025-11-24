import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TeamMember } from "@/lib/types";

interface TeamSectionProps {
  members: TeamMember[];
}

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-3 mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            Core Squad
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Отряд, который делает больно
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Каждый оператор покрывает свой сектор: от инфильтрации и
            электроника-варфейра до морального давления в голосовом чате.
          </p>
        </div>

        <div className="rounded-[32px] border bg-muted/30 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-6">
            {members.map((member) => (
              <Card
                key={member.id}
                className="p-6 h-full border border-border/60 bg-background/80 hover:border-primary/40 transition-all duration-200"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-20 w-20 shadow-lg shadow-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-semibold">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="uppercase tracking-wide">
                      {member.role || "Operator"}
                    </Badge>
                  </div>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {member.bio || "Досье засекречено."}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

