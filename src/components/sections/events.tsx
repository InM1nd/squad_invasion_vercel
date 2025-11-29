"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

interface ApiEvent {
  id: string;
  title: string;
  description: string | null;
  type?: string;
  game_mode?: string;
  start_date: string;
  end_date: string | null;
  server?: string | null;
  map?: string | null;
  max_participants?: number;
  is_public?: boolean;
  registration_open?: boolean;
  status?: string;
  source?: "platform" | "google_calendar";
  location?: string | null;
  htmlLink?: string | null;
}

export function EventsSection() {
  const t = useTranslations("events");
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch events from platform
        const platformRes = await fetch("/api/events?status=upcoming&limit=10");
        
        if (!platformRes.ok) {
          const errorText = await platformRes.text();
          console.error("Platform API error (landing):", platformRes.status, errorText);
          throw new Error(`Failed to fetch platform events: ${platformRes.status}`);
        }
        
        const platformData = await platformRes.json();
        
        if (platformData.error) {
          console.error("Platform API returned error (landing):", platformData.error);
          throw new Error(platformData.error || "Failed to fetch platform events");
        }

        // Mark platform events with source
        const platformEvents: ApiEvent[] = (platformData.events || []).map((event: ApiEvent) => ({
          ...event,
          source: "platform" as const,
        }));

        console.log("Platform events loaded (landing):", platformEvents.length);

        // Fetch events from Google Calendar directly from client
        let googleEvents: ApiEvent[] = [];
        try {
          const { fetchGoogleCalendarEvents } = await import("@/lib/google-calendar");
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          const futureDate = new Date();
          futureDate.setMonth(futureDate.getMonth() + 3); // Get events for next 3 months
          futureDate.setHours(23, 59, 59, 999);
          
          googleEvents = await fetchGoogleCalendarEvents(
            now.toISOString(),
            futureDate.toISOString(),
            10
          );
          console.log("Google Calendar events loaded (landing):", googleEvents.length);
        } catch (googleError) {
          console.warn("Failed to load Google Calendar events (landing):", googleError);
          // Continue without Google Calendar events if there's an error
        }

        // Combine events from both sources
        const allEvents = [...platformEvents, ...googleEvents];

        console.log("Total events (landing):", allEvents.length);

        // Filter out past events and sort by start_date
        const now = new Date();
        const futureEvents = allEvents.filter((event) => {
          const eventDate = new Date(event.start_date);
          return eventDate >= now;
        });

        // Sort by start_date
        futureEvents.sort((a, b) => {
          const dateA = new Date(a.start_date).getTime();
          const dateB = new Date(b.start_date).getTime();
          return dateA - dateB;
        });

        console.log("Future events after filtering:", futureEvents.length);

        // Transform to EventItem format
        const transformedEvents: EventItem[] = futureEvents.slice(0, 10).map((event: ApiEvent) => {
          const startDate = new Date(event.start_date);
          return {
            id: event.id,
            title: event.title,
            date: event.start_date,
            time: startDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            location: event.server || event.map || event.location || "",
            source: event.source || "platform",
            htmlLink: event.htmlLink || null,
          };
        });

        console.log("Transformed events (landing):", transformedEvents.length);
        setEvents(transformedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError(t("error"));
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [t]);

  const renderContent = () => {
    if (loading) {
      return (
        <Card className="p-8 text-center text-muted-foreground border-dashed">
          {t("loading")}
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="p-8 text-center space-y-4 border border-dashed">
          <p className="text-destructive font-semibold">{error}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" asChild>
              <a href="https://discord.gg/9w4N777V" target="_blank" rel="noreferrer">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("cta_request")}
              </a>
            </Button>
          </div>
        </Card>
      );
    }

    if (events.length === 0) {
      return (
        <Card className="p-8 text-center space-y-3 border-dashed">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">{t("emptyTitle")}</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {t("emptyDescription")}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button variant="default" asChild>
              <a href="https://discord.gg/9w4N777V" target="_blank" rel="noreferrer">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("cta_request")}
              </a>
            </Button>
          </div>
        </Card>
      );
    }

    return events.map((event) => {
      const date = new Date(event.date);
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const day = date.getDate();
      const isGoogleEvent = event.source === "google_calendar";

      return (
        <Card
          key={event.id}
          className={cn(
            "p-6 border border-border/70 hover:border-primary/40 transition-all duration-300 bg-card/90 backdrop-blur hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.02] group relative overflow-hidden",
            isGoogleEvent && "border-l-4 border-l-green-500"
          )}
          onClick={() => {
            if (isGoogleEvent && event.htmlLink) {
              window.open(event.htmlLink, "_blank");
            } else if (!isGoogleEvent) {
              // Navigate to event details page for platform events
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              router.push(`/events/${event.id}` as any);
            }
          }}
          style={!isGoogleEvent || event.htmlLink ? { cursor: "pointer" } : undefined}
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-primary/5 transition-all duration-300" />
          <div className="relative z-10 flex flex-col sm:flex-row flex-wrap gap-6 items-start sm:items-center">
            <div className="shrink-0">
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/50">
                <span className="text-xs font-medium uppercase">{month}</span>
                <span className="text-2xl font-bold">{day}</span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-lg md:text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                {isGoogleEvent && "📅 "}
                {event.title}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {event.time && (
                  <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1 transition-colors duration-300 group-hover:text-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>

            <Badge variant="secondary" className="self-start sm:self-center gap-1 transition-all duration-300 group-hover:scale-110">
              <Calendar className="h-3 w-3" />
              {t("badge")}
            </Badge>
          </div>
        </Card>
      );
    });
  };

  return (
    <section id="events" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 space-y-4 text-left">
          <div className="space-y-2">
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
          <div className="flex flex-wrap items-center justify-start gap-3">
            <Button asChild>
              <a href="https://discord.gg/9w4N777V" target="_blank" rel="noreferrer">
                <MessageSquare className="mr-2 h-4 w-4" />
                {t("cta_request")}
              </a>
            </Button>
          </div>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">{renderContent()}</div>
      </div>
    </section>
  );
}

