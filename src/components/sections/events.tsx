"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EventItem } from "@/lib/types";
import { useTranslations } from "next-intl";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

export function EventsSection() {
  const t = useTranslations("events");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDemo, setUsingDemo] = useState(false);

  const demoEvents: EventItem[] = [
    {
      id: "demo-1",
      title: "Harju Night Invasion // EU Prime",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "19:00 UTC",
      location: "Private server",
    },
    {
      id: "demo-2",
      title: "Territory scrim vs SunOps",
      date: new Date(Date.now() + 2 * 86400000).toISOString(),
      time: "20:30 UTC",
      location: "Custom lobby",
    },
    {
      id: "demo-3",
      title: "NA-friendly practice set",
      date: new Date(Date.now() + 4 * 86400000).toISOString(),
      time: "02:00 UTC",
      location: "Discord coordination",
    },
  ];

  useEffect(() => {
    async function fetchEvents() {
      if (!API_KEY || !CALENDAR_ID) {
        setUsingDemo(true);
        setEvents(demoEvents);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
            CALENDAR_ID,
          )}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime`,
        );
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        type CalendarApiEvent = {
          id: string;
          summary: string;
          start: { date?: string; dateTime?: string };
          location?: string;
        };
        const parsedEvents: EventItem[] = items.map((item: CalendarApiEvent) => ({
          id: item.id,
          title: item.summary,
          date: item.start.dateTime || item.start.date,
          time: item.start.dateTime
            ? new Date(item.start.dateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          location: item.location || "",
        }));
        setEvents(parsedEvents);
        setUsingDemo(false);
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
            <Button variant="secondary" disabled>
              <Calendar className="mr-2 h-4 w-4" />
              {t("cta_watch")}
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

      return (
        <Card
          key={event.id}
          className="p-6 border border-border/70 hover:border-primary/40 transition-all duration-200 bg-card/90 backdrop-blur"
        >
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 items-start sm:items-center">
            <div className="flex-shrink-0">
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                <span className="text-xs font-medium uppercase">{month}</span>
                <span className="text-2xl font-bold">{day}</span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-lg md:text-xl font-semibold text-foreground">
                {event.title}
              </h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {event.time && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>

            <Badge variant="secondary" className="self-start sm:self-center gap-1">
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
            <Button variant="outline" asChild>
              <a href={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID ?? "")}`} target="_blank" rel="noreferrer">
                <Calendar className="mr-2 h-4 w-4" />
                {t("cta_watch")}
              </a>
            </Button>
          </div>
          {usingDemo && (
            <div className="inline-flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-medium text-amber-700">
                <Sparkles className="h-3 w-3" />
                {t("demoNotice")}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">{renderContent()}</div>
      </div>
    </section>
  );
}

