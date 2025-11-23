/**
 * Contact Component
 * 
 * Displays team contact information in a three-column grid.
 * Shows email, Discord server, and region/timezone info.
 * Features icon-based cards with hover effects.
 */

import { Mail, MessageSquare, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ContactInfo } from "@shared/schema";

interface ContactProps {
  contact: ContactInfo;
}

export default function Contact({ contact }: ContactProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Section header */}
        <div className="space-y-3 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="section-contact-title">
            Contact Command
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Connect with our team leadership
          </p>
        </div>

        {/* Three-column grid for contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          {/* Email contact card */}
          <Card className="p-6 hover-elevate active-elevate-2 transition-all duration-200" data-testid="card-contact-email">
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Icon with subtle background */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Email
                </p>
                <p className="text-base text-foreground font-medium" data-testid="text-contact-email">
                  {contact.email}
                </p>
              </div>
            </div>
          </Card>

          {/* Discord/Voice contact card */}
          <Card className="p-6 hover-elevate active-elevate-2 transition-all duration-200 cursor-pointer" data-testid="card-contact-phone" >
            <div className="flex flex-col items-center text-center space-y-4" 
              onClick={() => {
                window.open(`${contact.phone}`, "_blank");
              }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Discord
                </p>
                <p
                  className="text-base text-foreground font-medium"
                  data-testid="text-contact-phone"
                >
                  {contact.phone}
                </p>
              </div>
            </div>
          </Card>

          {/* Region/Timezone card */}
          <Card className="p-6 hover-elevate active-elevate-2 transition-all duration-200" data-testid="card-contact-location">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Region
                </p>
                <p className="text-base text-foreground font-medium" data-testid="text-contact-location">
                  {contact.location}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
