/**
 * Events Component
 * 
 * Displays upcoming matches and events in a clean list format.
 * Each event shows date badge, match title, time, and location/server info.
 * Features responsive layout and hover interactions.
 */

import { Calendar, Clock, MapPin, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@shared/schema";

interface EventsProps {
  events: Event[];
}

export default function Events({ events }: EventsProps) {
  /**
   * Formats date string into month and day for display badge
   */
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate(),
    };
  };

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Section header */}
        <div className="space-y-3 mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
            Next Drops
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="section-events-title">
            Ближайшие операции
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Матчи, кастомки и тренировочные рейды. Мы держим календарь открытым, чтобы союзники успевали подстраиваться.
          </p>
        </div>

        {/* Event list - centered with max width for readability */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {events.length === 0 && (
            <Card className="p-8 text-center space-y-3 border-dashed">
              <div className="flex justify-center">
                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                  <Activity className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold">Операции скоро появятся</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Мы обновляем расписание сразу после подтверждения слотов. Загляните к нам в Discord, чтобы получить приоритетное уведомление.
              </p>
            </Card>
          )}
          {events.map((event) => {
            const { month, day } = formatDate(event.date);
            return (
              <Card
                key={event.id}
                className="p-6 border border-border/70 hover:border-primary/40 transition-all duration-200 bg-card/80 backdrop-blur"
                data-testid={`card-event-${event.id}`}
              >
                {/* Event card layout - date badge on left, info on right */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-6 items-start sm:items-center">
                  
                  {/* Date badge - stands out with primary color */}
                  <div className="flex-shrink-0">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                      <span className="text-xs font-medium uppercase">{month}</span>
                      <span className="text-2xl font-bold">{day}</span>
                    </div>
                  </div>

                  {/* Event details section */}
                  <div className="flex-1 space-y-2">
                    {/* Event title */}
                    <h3
                      className="text-lg md:text-xl font-semibold text-foreground"
                      data-testid={`text-event-title-${event.id}`}
                    >
                      {event.title}
                    </h3>

                    {/* Event metadata (time and location/server) */}
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

                  {/* Status badge */}
                  <Badge variant="secondary" className="self-start sm:self-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Locked In
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
