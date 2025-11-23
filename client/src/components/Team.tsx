/**
 * Team Component
 * 
 * Displays the squad roster in a responsive grid layout.
 * Shows player cards with avatars, callsigns, roles, and player descriptions.
 * Features hover effects for interactive feel.
 */

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { TeamMember } from "@shared/schema";

interface TeamProps {
  members: TeamMember[];
}

export default function Team({ members }: TeamProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Section header */}
        <div className="space-y-3 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="section-team-title">
            Squad Roster
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Our dedicated team of tactical operators
          </p>
        </div>

        {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {members.map((member) => (
            <Card
              key={member.id}
              className="p-6 hover-elevate active-elevate-2 transition-all duration-200"
              data-testid={`card-team-member-${member.id}`}
            >
              {/* Card content - centered layout */}
              <div className="flex flex-col items-center text-center space-y-4">
                
                {/* Player avatar with initials */}
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>

                {/* Player info section */}
                <div className="space-y-2">
                  {/* Player callsign/name */}
                  <h3 className="text-xl font-semibold text-foreground" data-testid={`text-member-name-${member.id}`}>
                    {member.name}
                  </h3>
                  
                  {/* Player role in squad (uppercase for military style) */}
                  <p className="text-sm uppercase tracking-wide text-muted-foreground font-medium">
                    {member.role}
                  </p>
                </div>

                {/* Player description/bio */}
                <p className="text-sm md:text-base text-card-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
