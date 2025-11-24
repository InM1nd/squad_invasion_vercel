export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface EventItem {
  id: string;
  date: string;
  title: string;
  time?: string;
  location?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: "twitch" | "youtube" | "x" | "instagram" | "discord" | "steam";
}

