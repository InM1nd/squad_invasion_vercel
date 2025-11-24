import type {
  ContactInfo,
  EventItem,
  GalleryItem,
  ScheduleBlock,
  AvailabilitySlot,
  SocialLink,
  TeamMember,
} from "@/lib/types";
import { ShieldCheck, Zap, Waves } from "lucide-react";

export const teamMembers: TeamMember[] = [
  { id: "1", translationKey: "members.sin", initials: "SIN" },
  { id: "2", translationKey: "members.thirteen", initials: "13" },
  { id: "3", translationKey: "members.satana", initials: "SvT" },
  { id: "4", translationKey: "members.metr", initials: "MP" },
];

export const contactInfo: ContactInfo = {
  email: "dixon.ltd50@gmail.com",
  discord: "https://discord.gg/9w4N777V",
  regionKey: "regionValue",
};

export const socialLinks: SocialLink[] = [
  { id: "twitch", labelKey: "items.twitch", url: "https://twitch.tv", icon: "twitch" },
  { id: "youtube", labelKey: "items.youtube", url: "https://youtube.com", icon: "youtube" },
  { id: "x", labelKey: "items.x", url: "https://x.com", icon: "x" },
  { id: "discord", labelKey: "items.discord", url: "https://discord.gg", icon: "discord" },
  {
    id: "steam",
    labelKey: "items.steam",
    url: "https://steamcommunity.com/groups",
    icon: "steam",
  },
];

export const highlightCards = [
  {
    id: "discipline",
    translationKey: "cards.discipline",
    icon: Waves,
    accent: "cyan" as const,
  },
  {
    id: "adapt",
    translationKey: "cards.adapt",
    icon: Zap,
    accent: "amber" as const,
  },
  {
    id: "shield",
    translationKey: "cards.shield",
    icon: ShieldCheck,
    accent: "violet" as const,
  },
];

export const intelFeed = [
  {
    id: "ops",
    translationKey: "items.ops",
    status: "up" as const,
  },
  {
    id: "scrim",
    translationKey: "items.scrim",
    status: "steady" as const,
  },
  {
    id: "recruits",
    translationKey: "items.recruits",
    status: "up" as const,
  },
  {
    id: "support",
    translationKey: "items.support",
    status: "down" as const,
  },
];

export const galleryCards: GalleryItem[] = [
  {
    id: "harju-night",
    translationKey: "cards.harju",
    accent: "rose",
  },
  {
    id: "mutaha-bridge",
    translationKey: "cards.mutaha",
    accent: "violet",
  },
  {
    id: "fallujah-rush",
    translationKey: "cards.fallujah",
    accent: "cyan",
  },
];

export const scheduleBlocks: ScheduleBlock[] = [
  { id: "primary", translationKey: "blocks.primary", accent: "rose" },
  { id: "alt", translationKey: "blocks.alt", accent: "violet" },
  { id: "support", translationKey: "blocks.support", accent: "cyan" },
  { id: "rules", translationKey: "blocks.rules", accent: "amber" },
];

export type { EventItem };

