"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Gamepad2, 
  ArrowLeft, 
  Swords,
  Trophy,
  Target,
  Shield
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getMapById } from "@/data/squad-maps";

interface EventDetails {
  id: string;
  title: string;
  description: string | null;
  type: string;
  game_mode: string;
  start_date: string;
  end_date: string | null;
  server: string | null;
  map: string | null;
  map_image: string | null;
  team1_name: string | null;
  team1_image: string | null;
  team2_name: string | null;
  team2_image: string | null;
  max_participants: number;
  is_public: boolean;
  registration_open: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  organizer_id: string;
  users?: {
    id: string;
    username: string;
    display_name: string | null;
  };
}

export function EventDetailsPage({ eventId }: { eventId: string }) {
  const router = useRouter();
  const t = useTranslations("events");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<EventDetails | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch event");
        }

        setEvent(data.event);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6 p-8">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <Target className="h-10 w-10 text-destructive" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
            <p className="text-muted-foreground">{error || "The event you're looking for doesn't exist."}</p>
          </div>
          <Button onClick={() => router.push("/")} variant="outline" size="lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Button>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const mapData = event.map ? getMapById(event.map.toLowerCase().replace(/\s+/g, "_")) : null;
  const hasTeams = event.team1_name || event.team2_name;

  // Format date nicely
  const formattedDate = startDate.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const formattedTime = startDate.toLocaleTimeString("ru-RU", { 
    hour: "2-digit", 
    minute: "2-digit" 
  });

  // Event type icons
  const typeIcons: Record<string, typeof Trophy> = {
    clan_war: Swords,
    scrim: Target,
    tournament: Trophy,
    training: Shield,
  };
  const TypeIcon = typeIcons[event.type] || Gamepad2;

  return (
    <div className="min-h-screen -mt-8 -mx-4 sm:-mx-6">
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        {/* Background Image or Gradient */}
        <div className="absolute inset-0 z-0">
          {event.map_image ? (
            <>
              <Image
                src={event.map_image}
                alt=""
                fill
                className="object-cover opacity-30 blur-sm scale-105"
                unoptimized={!event.map_image.includes("supabase")}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          )}
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-primary/50 rotate-45" />
            <div className="absolute bottom-20 right-20 w-48 h-48 border border-primary/30 rotate-12" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-primary/20 -rotate-12" />
          </div>
        </div>

        {/* Back Button */}
        <div className="relative z-10 pt-8 px-4 sm:px-6">
          <Button 
            onClick={() => router.push("/")} 
            variant="ghost" 
            className="hover:bg-background/50 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToHome")}
          </Button>
        </div>

        {/* Event Header */}
        <div className="relative z-10 px-4 sm:px-6 pt-8 pb-16">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            {/* Event Type Badge */}
            <div className="flex justify-center gap-3">
              <Badge 
                variant="outline" 
                className="px-4 py-1.5 text-sm border-primary/50 bg-primary/10 backdrop-blur-sm"
              >
                <TypeIcon className="h-4 w-4 mr-2" />
                {event.type.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge 
                variant={event.status === "upcoming" ? "default" : "secondary"}
                className="px-4 py-1.5 text-sm"
              >
                {event.status.toUpperCase()}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                {event.title}
              </span>
            </h1>

            {/* Date & Time */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="capitalize">{formattedDate}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground" />
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>{formattedTime}</span>
                {endDate && (
                  <span className="text-muted-foreground/60">
                    — {endDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {event.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Teams VS Section */}
      {hasTeams && (
        <div className="relative z-10 px-4 sm:px-6 -mt-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-4 items-center">
                  {/* Team 1 */}
                  <div className="text-center space-y-4 group">
                    <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40">
                      {event.team1_image ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors shadow-lg">
                          <Image
                            src={event.team1_image}
                            alt={event.team1_name || "Team 1"}
                            fill
                            className="object-cover"
                            unoptimized={!event.team1_image.includes("supabase")}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/30 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                          <Shield className="h-16 w-16 text-blue-500/50" />
                        </div>
                      )}
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-blue-400 transition-colors">
                      {event.team1_name || "Team 1"}
                    </h3>
                  </div>

                  {/* VS Badge */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
                        <span className="text-2xl md:text-3xl font-black text-primary">VS</span>
                      </div>
                      {/* Animated ring */}
                      <div className="absolute -inset-2 border border-primary/20 rounded-full animate-pulse" />
                      <div className="absolute -inset-4 border border-primary/10 rounded-full" />
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="text-center space-y-4 group">
                    <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40">
                      {event.team2_image ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors shadow-lg">
                          <Image
                            src={event.team2_image}
                            alt={event.team2_name || "Team 2"}
                            fill
                            className="object-cover"
                            unoptimized={!event.team2_image.includes("supabase")}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center group-hover:border-red-500/50 transition-colors">
                          <Swords className="h-16 w-16 text-red-500/50" />
                        </div>
                      )}
                      {/* Glow effect */}
                      <div className="absolute -inset-1 bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-red-400 transition-colors">
                      {event.team2_name || "Team 2"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="relative z-10 px-4 sm:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Game Mode */}
            <div className="group p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Gamepad2 className="h-5 w-5" />
                </div>
                <span className="text-sm text-muted-foreground">{t("gameMode")}</span>
              </div>
              <p className="text-lg font-semibold">{event.game_mode.replace("_", " ").toUpperCase()}</p>
            </div>

            {/* Map */}
            {event.map && (
              <div className="group p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-muted-foreground">{t("map")}</span>
                </div>
                <p className="text-lg font-semibold">{mapData?.displayName || event.map}</p>
              </div>
            )}

            {/* Server */}
            {event.server && (
              <div className="group p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-muted-foreground">{t("server")}</span>
                </div>
                <p className="text-lg font-semibold">{event.server}</p>
              </div>
            )}

            {/* Participants */}
            <div className="group p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm text-muted-foreground">{t("participants")}</span>
              </div>
              <p className="text-lg font-semibold">{event.max_participants}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Image Section (if uploaded) */}
      {event.map_image && (
        <div className="relative z-10 px-4 sm:px-6 pb-12">
          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              <Image
                src={event.map_image}
                alt={event.map || "Map"}
                fill
                className="object-cover"
                unoptimized={!event.map_image.includes("supabase")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <Badge variant="secondary" className="text-lg px-4 py-2 backdrop-blur-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  {mapData?.displayName || event.map}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration CTA */}
      {event.registration_open && (
        <div className="relative z-10 px-4 sm:px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 p-8 md:p-12 text-center">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full" 
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                  }} 
                />
              </div>
              
              <div className="relative z-10 space-y-4">
                <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold">{t("registrationOpen")}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {t("registrationDescription")}
                </p>
                <Button size="lg" className="mt-4 px-8 text-lg h-12">
                  {t("register")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
