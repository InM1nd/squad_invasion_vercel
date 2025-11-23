/**
 * Home Page
 * 
 * Main landing page for the Alpha Squad gaming team website.
 * Displays all major sections: Header, Team Roster, Events, Contact, and Social Links.
 * 
 * Theme: Squad Invasion Mode - Military tactical aesthetic with dark greens and grays.
 * All data is currently placeholder and can be replaced with dynamic data from API.
 */

import Header from "@/components/Header";
import Team from "@/components/Team";
import Events from "@/components/Events";
import Contact from "@/components/Contact";
import Links from "@/components/Links";
import type { TeamMember, Event, ContactInfo, SocialLink } from "@shared/schema";

/**
 * TEAM ROSTER DATA
 * Array of team members with their callsigns, roles, and bios
 */
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Шальной Пупсик",
    role: "Медик убийца",
    bio: "Специалист по восстановлению и нанесению урона. Всегда держит команду в тонусе.",
    initials: "ШП",
  },
  {
    id: "2",
    name: "Кузминыч",
    role: "Стрелок, мясник",
    bio: "Эксперт по огневой поддержке. Никого не щадит на поле боя.",
    initials: "КЗ",
  },
  {
    id: "3",
    name: "Писька в трико",
    role: "Ходит с писькой в трико",
    bio: "Загадочный персонаж команды, известный своими странными проделками.",
    initials: "ПТ",
  },
  {
    id: "4",
    name: "Секс Инструктор НАТО",
    role: "Диктатор",
    bio: "Командует всей операцией и строго следит за порядком в отряде.",
    initials: "СИН",
  },
  {
    id: "5",
    name: "Мерт Пихалыч",
    role: "Напихивает",
    bio: "Главный по наступлениям. Любит действовать решительно и эффективно.",
    initials: "МП",
  },
];

/**
 * UPCOMING EVENTS DATA
 * Scheduled matches, scrims, and training sessions
 */
const upcomingEvents: Event[] = [
  {
    id: "1",
    date: "2025-01-10",
    title: "Игра против немецкого сервера WE Love Squad",
    time: "8:00 PM CET",
    location: "Сервер WE Love Squad",
  },
  {
    id: "2",
    date: "2025-01-24",
    title: "Игра против американцев Marines",
    time: "8:00 PM EST",
    location: "Сервер Marines",
  },
];

/**
 * CONTACT INFORMATION
 * Team contact details for recruitment and inquiries
 */
const contactInfo: ContactInfo = {
  email: "penis@gmail.com",
  phone: "",
  location: "Europe",
};

/**
 * SOCIAL MEDIA LINKS
 * Streaming and social platform links
 */
const socialLinks: SocialLink[] = [
  {
    id: "1",
    name: "Twitch",
    url: "https://twitch.tv",
    icon: "twitch",
  },
  {
    id: "2",
    name: "YouTube",
    url: "https://youtube.com",
    icon: "youtube",
  },
  {
    id: "3",
    name: "X",
    url: "https://x.com",
    icon: "x",
  },
  {
    id: "4",
    name: "Discord",
    url: "https://discord.gg",
    icon: "discord",
  },
  {
    id: "5",
    name: "Steam",
    url: "https://steamcommunity.com/groups",
    icon: "steam",
  },
];

/**
 * HOME PAGE COMPONENT
 * Renders all sections with tactical military-themed background gradient
 */
export default function Home() {
  return (
    // Main container with military-themed gradient background
    // Dark green to slate gray gradient for tactical aesthetic
    <div className="min-h-screen">
      {/* Subtle backdrop blur for depth */}
      <div className="min-h-screen backdrop-blur-[1px]">
        
        {/* Header section with team logo and title */}
        <Header />
        
        {/* Team roster grid */}
        <Team members={teamMembers} />
        
        {/* Upcoming events/matches list */}
        <Events events={upcomingEvents} />
        
        {/* Contact information cards */}
        <Contact contact={contactInfo} />
        
        {/* Social media and streaming platform links */}
        <Links links={socialLinks} />
        
        {/* Footer with copyright */}
        <footer className="py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Штаб Наслаждений.</p>
        </footer>
      </div>
    </div>
  );
}
