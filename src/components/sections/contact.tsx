import { Card } from "@/components/ui/card";
import type { ContactInfo } from "@/lib/types";
import { Globe, Mail, MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface ContactSectionProps {
  contact: ContactInfo;
}

export async function ContactSection({ contact }: ContactSectionProps) {
  const t = await getTranslations("contact");

  return (
    <section id="contact" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-3 mb-12 text-left">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center space-y-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-primary/5 transition-all duration-300" />
            <div className="relative z-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-3">
                <Mail className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <div className="space-y-1 mt-4">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  {t("emailLabel")}
                </p>
                <p className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">{contact.email}</p>
              </div>
            </div>
          </Card>

          <Card className="p-0 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-primary/5 transition-all duration-300" />
            <a
              href={contact.discord}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center space-y-4 p-6 text-center relative z-10"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-3">
                <MessageSquare className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  {t("discordLabel")}
                </p>
                <p className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">{contact.discord}</p>
              </div>
            </a>
          </Card>

          <Card className="p-6 text-center space-y-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-primary/5 transition-all duration-300" />
            <div className="relative z-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:rotate-3">
                <Globe className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <div className="space-y-1 mt-4">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  {t("regionLabel")}
                </p>
                <p className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {t(contact.regionKey)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
