/**
 * Shared Schema Definitions
 * 
 * TypeScript interfaces and types used across both frontend and backend.
 * Includes database schemas (Drizzle ORM) and application data models.
 */

import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * USER TABLE SCHEMA
 * Database table for user authentication (future use)
 */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Zod schema for user insertion validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// TypeScript types derived from schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

/**
 * TEAM MEMBER INTERFACE
 * Represents a squad member/player on the team
 */
export interface TeamMember {
  id: string;           // Unique identifier
  name: string;         // Player callsign/gamertag
  role: string;         // Squad role (e.g., "Squad Leader", "Medic")
  bio: string;          // Player description/background
  initials: string;     // Initials for avatar fallback
}

/**
 * EVENT INTERFACE
 * Represents a scheduled match, scrim, or training session
 */
export interface Event {
  id: string;           // Unique identifier
  date: string;         // Event date (ISO format)
  title: string;        // Event name/description
  time?: string;        // Optional time (e.g., "8:00 PM EST")
  location?: string;    // Optional server/location info
}

/**
 * CONTACT INFO INTERFACE
 * Team contact information
 */
export interface ContactInfo {
  email: string;        // Contact email
  phone: string;        // Discord tag or other contact method
  location: string;     // Region/timezone
}

/**
 * SOCIAL LINK INTERFACE
 * Social media and streaming platform links
 */
export interface SocialLink {
  id: string;                    // Unique identifier
  name: string;                  // Platform name (e.g., "Twitch")
  url: string;                   // Full URL to platform page
  icon: 'twitch' | 'youtube' | 'x' | 'instagram' | 'discord' | 'steam';  // Icon identifier
}
