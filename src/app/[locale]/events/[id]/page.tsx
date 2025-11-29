import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EventDetailsPage } from "@/components/events/event-details-page";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export const dynamic = 'force-dynamic';

export default async function EventDetails({ params }: Props) {
  const { locale: rawLocale, id } = await params;
  
  if (!(routing.locales as readonly string[]).includes(rawLocale)) {
    notFound();
  }
  
  const locale = rawLocale as (typeof routing.locales)[number];
  const t = await getTranslations({ locale, namespace: "events" });

  return <EventDetailsPage eventId={id} />;
}

