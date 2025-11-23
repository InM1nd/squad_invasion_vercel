import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Team from "@/components/Team";
import Events from "@/components/Events";
import Contact from "@/components/Contact";
import Links from "@/components/Links";
import type { TeamMember, Event, ContactInfo, SocialLink } from "@shared/schema";

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: "Sex Instructor NATO",
    role: "",
    bio: "",
    initials: "SIN",
  },
  {
    id: '2',
    name: "13th",
    role: "",
    bio: "",
    initials: "13",
  },
  {
    id: '3',
    name: "Satana v Triko",
    role: "",
    bio: "",
    initials: "SvT",
  },
  {
    id: '4',
    name: "Metr Pihalych",
    role: "",
    bio: "",
    initials: "MP",
  },
];

const contactInfo: ContactInfo = { email: "dixon.ltd50@gmail.com", phone: "https://discord.gg/9w4N777V", location: "Europe" };
const socialLinks: SocialLink[] = [
  { id: "1", name: "Twitch", url: "https://twitch.tv", icon: "twitch" },
  { id: "2", name: "YouTube", url: "https://youtube.com", icon: "youtube" },
  { id: "3", name: "X", url: "https://x.com", icon: "x" },
  { id: "4", name: "Discord", url: "https://discord.gg", icon: "discord" },
  { id: "5", name: "Steam", url: "https://steamcommunity.com/groups", icon: "steam" },
];

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_KEY = 'AIzaSyAF0AxGPf7BI9F7sz9sxpltqSkZRi4y1RE';
    const calendarId = "8f501d7b182f551c0a655c10f9fe0c5ff177e75a2435ffda4ea07d60545b6fa3@group.calendar.google.com";

    async function fetchEvents() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime`
        );
        const data = await res.json();
        const parsedEvents: Event[] = data.items.map((item: any) => ({
          id: item.id,
          title: item.summary,
          date: item.start.dateTime || item.start.date,
          time: item.start.dateTime
            ? new Date(item.start.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "",
          location: item.location || "",
        }));
        setEvents(parsedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="min-h-screen backdrop-blur-[1px]">
        <Header />
        <Team members={teamMembers} />

        {loading ? <p className="text-center py-8">Loading events...</p> : <Events events={events} />}

        <Contact contact={contactInfo} />
        <Links links={socialLinks} />

        <footer className="py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Штаб Наслаждений.</p>
        </footer>
      </div>
    </div>
  );
}
