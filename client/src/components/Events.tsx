/**
 * Events Component
 * 
 * Displays upcoming matches and events in a clean list format.
 * Each event shows date badge, match title, time, and location/server info.
 * Features responsive layout and hover interactions.
 */

import { Calendar, Clock, MapPin } from "lucide-react";
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="section-events-title">
            Upcoming Operations
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Scheduled matches, scrims, and training sessions
          </p>
        </div>

        {/* Event list - centered with max width for readability */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {events.map((event) => {
            const { month, day } = formatDate(event.date);
            return (
              <Card
                key={event.id}
                className="p-6 hover-elevate active-elevate-2 transition-all duration-200"
                data-testid={`card-event-${event.id}`}
              >
                {/* Event card layout - date badge on left, info on right */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-6 items-start sm:items-center">
                  
                  {/* Date badge - stands out with primary color */}
                  <div className="flex-shrink-0">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary text-primary-foreground">
                      <span className="text-xs font-medium uppercase">{month}</span>
                      <span className="text-2xl font-bold">{day}</span>
                    </div>
                  </div>

                  {/* Event details section */}
                  <div className="flex-1 space-y-2">
                    {/* Event title */}
                    <h3 className="text-lg md:text-xl font-medium text-foreground" data-testid={`text-event-title-${event.id}`}>
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
                  <Badge variant="secondary" className="self-start sm:self-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Upcoming
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
