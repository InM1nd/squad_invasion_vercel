import { Card } from "@/components/ui/card";
import type { ContactInfo } from "@/lib/types";
import { Globe, Mail, MessageSquare } from "lucide-react";

interface ContactSectionProps {
  contact: ContactInfo;
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-3 mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            Contact Command
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Связь с штабом
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Три канала, через которые быстрее всего выйти на офицеров.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <p className="text-base font-medium text-foreground">
                {contact.email}
              </p>
            </div>
          </Card>

          <Card className="p-0">
            <a
              href={contact.phone}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center space-y-4 p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  Discord
                </p>
                <p className="text-base font-medium text-foreground">
                  {contact.phone}
                </p>
              </div>
            </a>
          </Card>

          <Card className="p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-wide text-muted-foreground">
                Region
              </p>
              <p className="text-base font-medium text-foreground">
                {contact.location}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

