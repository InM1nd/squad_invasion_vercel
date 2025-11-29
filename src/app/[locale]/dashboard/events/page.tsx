"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, Users, Clock } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

interface Event {
  id: string;
  title: string;
  description: string | null;
  type: string;
  game_mode: string;
  start_date: string;
  end_date: string | null;
  server: string | null;
  map: string | null;
  max_participants: number;
  is_public: boolean;
  registration_open: boolean;
  status: string;
  users?: {
    username: string | null;
    display_name: string | null;
  };
}

export default function EventsPage() {
  const router = useRouter();
  const t = useTranslations("dashboard.events");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events?status=all&limit=50");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch events");
      }

      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">{t("empty")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => {
            const startDate = new Date(event.start_date);
            const month = startDate.toLocaleDateString("ru-RU", { month: "short" });
            const day = startDate.getDate();

            return (
              <Card
                key={event.id}
                className="hover:border-primary/40 transition-all duration-300 cursor-pointer"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => router.push(`/dashboard/events/${event.id}` as any)}
              >
                <CardHeader>
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0">
                      <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground">
                        <span className="text-xs font-medium uppercase">{month}</span>
                        <span className="text-2xl font-bold">{day}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                      {event.description && (
                        <CardDescription className="line-clamp-2">
                          {event.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {t(`type.${event.type}`) || event.type}
                      </Badge>
                      <Badge variant="secondary">
                        {t(`gameMode.${event.game_mode}`) || event.game_mode}
                      </Badge>
                      <Badge variant={event.status === "upcoming" ? "default" : "outline"}>
                        {t(`status.${event.status}`) || event.status}
                      </Badge>
                      {event.registration_open && (
                        <Badge variant="outline">{t("registrationOpen")}</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(event.start_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.start_date)}</span>
                      </div>
                      {event.server && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.server}</span>
                        </div>
                      )}
                      {event.map && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.map}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {t("maxParticipants")}: {event.max_participants}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

