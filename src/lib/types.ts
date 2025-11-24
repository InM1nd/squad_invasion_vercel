export interface TeamMember {
  id: string;
  translationKey: string;
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
  discord: string;
  regionKey: string;
}

export interface SocialLink {
  id: string;
  labelKey: string;
  url: string;
  icon: "twitch" | "youtube" | "x" | "instagram" | "discord" | "steam";
}

export interface GalleryItem {
  id: string;
  translationKey: string;
  accent: "rose" | "violet" | "cyan";
}

export interface ScheduleBlock {
  id: string;
  translationKey: string;
  accent: "rose" | "violet" | "cyan" | "amber";
}

