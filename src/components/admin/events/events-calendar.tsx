"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
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
  created_at?: string;
  organizer_id?: string;
  source?: "platform" | "google_calendar";
  location?: string | null;
  htmlLink?: string | null;
}

export function EventsCalendar() {
  const router = useRouter();
  const t = useTranslations("dashboard.admin.events");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate date range for current month view
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      // Fetch events from platform - get more events to cover adjacent months
      const platformResponse = await fetch("/api/events?status=all&limit=200");
      
      if (!platformResponse.ok) {
        const errorText = await platformResponse.text();
        console.error("Platform API error:", platformResponse.status, errorText);
        throw new Error(`Failed to fetch platform events: ${platformResponse.status}`);
      }
      
      const platformData = await platformResponse.json();
      
      if (platformData.error) {
        console.error("Platform API returned error:", platformData.error);
        throw new Error(platformData.error || "Failed to fetch platform events");
      }

      // Mark platform events with source
      const platformEvents: Event[] = (platformData.events || []).map((event: Event) => ({
        ...event,
        source: "platform" as const,
      }));

      console.log("Platform events loaded:", platformEvents.length);
      if (platformEvents.length > 0) {
        console.log("Sample platform event:", {
          id: platformEvents[0].id,
          title: platformEvents[0].title,
          start_date: platformEvents[0].start_date,
          status: platformEvents[0].status,
          is_public: platformEvents[0].is_public,
        });
      } else {
        console.warn("No platform events found! Check /api/events/debug to see what's in the database");
      }

      // Fetch events from Google Calendar
      // Expand range to include events from adjacent months for better UX
      const expandedStart = new Date(monthStart);
      expandedStart.setMonth(expandedStart.getMonth() - 1);
      const expandedEnd = new Date(monthEnd);
      expandedEnd.setMonth(expandedEnd.getMonth() + 1);
      
      // Fetch events from Google Calendar directly from client
      let googleEvents: Event[] = [];
      try {
        const { fetchGoogleCalendarEvents } = await import("@/lib/google-calendar");
        googleEvents = await fetchGoogleCalendarEvents(
          expandedStart.toISOString(),
          expandedEnd.toISOString(),
          200
        );
        console.log("Google Calendar events loaded:", googleEvents.length);
      } catch (googleError) {
        console.warn("Failed to load Google Calendar events:", googleError);
        // Continue without Google Calendar events if there's an error
      }

      // Combine events from both sources
      const allEvents = [...platformEvents, ...googleEvents];

      console.log("Total events:", allEvents.length);

      // Sort by start_date
      allEvents.sort((a, b) => {
        const dateA = new Date(a.start_date).getTime();
        const dateB = new Date(b.start_date).getTime();
        return dateA - dateB;
      });

      setEvents(allEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Get first day of month and number of days
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const firstDayOfWeek = monthStart.getDay();

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    events.forEach((event) => {
      try {
        const eventDate = new Date(event.start_date);
        // Check if date is valid
        if (isNaN(eventDate.getTime())) {
          console.warn("Invalid date for event:", event.id, event.start_date);
          return;
        }
        const dateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      } catch (err) {
        console.error("Error processing event date:", event.id, err);
      }
    });
    console.log("Events grouped by date:", Object.keys(grouped).length, "dates");
    return grouped;
  }, [events]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (day: number): Event[] => {
    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return eventsByDate[dateKey] || [];
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const monthNames = [
    t("calendar.january"),
    t("calendar.february"),
    t("calendar.march"),
    t("calendar.april"),
    t("calendar.may"),
    t("calendar.june"),
    t("calendar.july"),
    t("calendar.august"),
    t("calendar.september"),
    t("calendar.october"),
    t("calendar.november"),
    t("calendar.december"),
  ];

  const weekDays = [
    t("calendar.sunday"),
    t("calendar.monday"),
    t("calendar.tuesday"),
    t("calendar.wednesday"),
    t("calendar.thursday"),
    t("calendar.friday"),
    t("calendar.saturday"),
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error}</p>
          <Button onClick={fetchEvents} className="mt-4">
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            {t("calendar.today")}
          </Button>
          <Button onClick={() => router.push("/dashboard/admin/events/create")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("list.createButton")}
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day.slice(0, 2)}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month start */}
            {Array.from({ length: firstDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDate(day);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day}
                  className={cn(
                    "aspect-square border rounded-lg p-2 overflow-y-auto hover:bg-accent transition-colors",
                    isCurrentDay && "ring-2 ring-primary"
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-1",
                      isCurrentDay && "text-primary"
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => {
                      const isGoogleEvent = event.source === "google_calendar";
                      const eventStatus = event.status || (isGoogleEvent ? "upcoming" : "completed");
                      
                      return (
                        <div
                          key={event.id}
                          onClick={() => {
                            if (isGoogleEvent && event.htmlLink) {
                              window.open(event.htmlLink, "_blank");
                            } else if (!isGoogleEvent) {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              router.push(`/dashboard/admin/events/${event.id}/edit` as any);
                            }
                          }}
                          className={cn(
                            "text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity",
                            eventStatus === "upcoming"
                              ? "bg-primary/20 text-primary"
                              : eventStatus === "ongoing"
                              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                              : "bg-muted text-muted-foreground",
                            isGoogleEvent && "border-l-2 border-l-green-500"
                          )}
                          title={event.title}
                        >
                          <div className="truncate font-medium">
                            {isGoogleEvent && "📅 "}
                            {event.title}
                          </div>
                          <div className="text-[10px] opacity-75">
                            {new Date(event.start_date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 3} {t("calendar.more")}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-muted-foreground">
          Всего событий: {events.length} | Дат с событиями: {Object.keys(eventsByDate).length}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20" />
          <span>{t("calendar.legend.upcoming")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/20" />
          <span>{t("calendar.legend.ongoing")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted" />
          <span>{t("calendar.legend.completed")}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-l-2 border-l-green-500" />
          <span>Google Calendar</span>
        </div>
      </div>
    </div>
  );
}

