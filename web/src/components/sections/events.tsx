"use client";

import { useEffect, useState } from "react";
import { Activity, Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EventItem } from "@/lib/types";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;

export function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!API_KEY || !CALENDAR_ID) {
        setError("Календарь временно недоступен");
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
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Не удалось загрузить операции");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <Card className="p-8 text-center text-muted-foreground border-dashed">
          Загружаем расписание...
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="p-8 text-center text-destructive border-dashed">
          {error}
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
          <h3 className="text-xl font-semibold">Операции скоро появятся</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Мы обновляем расписание сразу после подтверждения слотов. Загляните к
            нам в Discord, чтобы получить приоритетное уведомление.
          </p>
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
              Locked In
            </Badge>
          </div>
        </Card>
      );
    });
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-3 mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            Next Drops
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ближайшие операции
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Матчи, кастомки и тренировочные рейды. Мы держим календарь открытым,
            чтобы союзники успевали подстраиваться.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">{renderContent()}</div>
      </div>
    </section>
  );
}

