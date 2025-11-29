/**
 * Shared Schema Definitions
 * 
 * TypeScript interfaces and types used across both frontend and backend.
 * Includes database schemas (Drizzle ORM) and application data models.
 */

import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

/**
 * ENUMS
 */
export const eventTypeEnum = pgEnum("event_type", [
  "clan_war",
  "scrim",
  "tournament",
  "training",
]);

export const gameModeEnum = pgEnum("game_mode", [
  "invasion",
  "territory_control",
  "raas",
  "aas",
]);

export const clanRoleEnum = pgEnum("clan_role", ["leader", "officer", "member"]);

export const registrationStatusEnum = pgEnum("registration_status", [
  "registered",
  "waitlist",
  "cancelled",
]);

export const userRoleEnum = pgEnum("user_role", [
  "user",
  "event_admin",
  "admin",
  "super_admin",
]);

/**
 * USERS TABLE SCHEMA
 * Extended user table with authentication and profile information
 */
export const users = pgTable(
  "users",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    // Authentication (Supabase Auth will handle this, but we store additional data)
    email: text("email").notNull().unique(),
    username: text("username").notNull().unique(),
    // Profile
    displayName: text("display_name"),
    avatar: text("avatar"), // URL to avatar image in Supabase Storage
    bio: text("bio"),
    // External accounts
    steamId: text("steam_id").unique(),
    discordId: text("discord_id").unique(),
    googleId: text("google_id").unique(),
    // Statistics
    rating: integer("rating").default(1000).notNull(), // ELO rating, default 1000
    // Admin roles
    role: userRoleEnum("role").default("user").notNull(),
    // Banned status
    isBanned: boolean("is_banned").default(false).notNull(),
    bannedUntil: timestamp("banned_until"), // null = permanent ban
    banReason: text("ban_reason"),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    usernameIdx: index("users_username_idx").on(table.username),
    steamIdIdx: index("users_steam_id_idx").on(table.steamId),
    discordIdIdx: index("users_discord_id_idx").on(table.discordId),
    googleIdIdx: index("users_google_id_idx").on(table.googleId),
  })
);

/**
 * EVENTS TABLE SCHEMA
 * Events/matches table
 */
export const events = pgTable(
  "events",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    description: text("description"),
    type: eventTypeEnum("type").notNull(),
    gameMode: gameModeEnum("game_mode").notNull(),
    // Scheduling
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),
    // Location/Server
    server: text("server"),
    map: text("map"),
    // Limits
    maxParticipants: integer("max_participants").notNull().default(50),
    // Organizer
    organizerId: varchar("organizer_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Settings
    isPublic: boolean("is_public").default(true).notNull(),
    registrationOpen: boolean("registration_open").default(true).notNull(),
    // Status
    status: varchar("status", { length: 20 })
      .default("upcoming")
      .notNull(), // upcoming, ongoing, completed, cancelled
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    organizerIdx: index("events_organizer_idx").on(table.organizerId),
    startDateIdx: index("events_start_date_idx").on(table.startDate),
    statusIdx: index("events_status_idx").on(table.status),
  })
);

/**
 * CLANS TABLE SCHEMA
 * Clans/groups table
 */
export const clans = pgTable(
  "clans",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull().unique(),
    tag: varchar("tag", { length: 10 }).notNull().unique(), // Clan tag like [SQUAD]
    description: text("description"),
    logo: text("logo"), // URL to logo in Supabase Storage
    // Leader
    leaderId: varchar("leader_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    // Statistics
    rating: integer("rating").default(1000).notNull(),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    leaderIdx: index("clans_leader_idx").on(table.leaderId),
    tagIdx: index("clans_tag_idx").on(table.tag),
  })
);

/**
 * CLAN MEMBERS TABLE SCHEMA
 * Many-to-many relationship between users and clans
 */
export const clanMembers = pgTable(
  "clan_members",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    clanId: varchar("clan_id")
      .notNull()
      .references(() => clans.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: clanRoleEnum("role").default("member").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    clanUserIdx: index("clan_members_clan_user_idx").on(
      table.clanId,
      table.userId
    ),
    userIdx: index("clan_members_user_idx").on(table.userId),
  })
);

/**
 * EVENT REGISTRATIONS TABLE SCHEMA
 * Registrations for events (individual or clan-based)
 */
export const eventRegistrations = pgTable(
  "event_registrations",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    eventId: varchar("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clanId: varchar("clan_id").references(() => clans.id, {
      onDelete: "set null",
    }), // Optional: registration as part of clan
    status: registrationStatusEnum("status").default("registered").notNull(),
    registeredAt: timestamp("registered_at").defaultNow().notNull(),
  },
  (table) => ({
    eventUserIdx: index("event_registrations_event_user_idx").on(
      table.eventId,
      table.userId
    ),
    eventIdx: index("event_registrations_event_idx").on(table.eventId),
    userIdx: index("event_registrations_user_idx").on(table.userId),
  })
);

/**
 * EVENT TEAMS TABLE SCHEMA
 * Teams formed for events (auto or manually assigned)
 */
export const eventTeams = pgTable(
  "event_teams",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    eventId: varchar("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    teamName: text("team_name").notNull(),
    // Store team members as JSON array of user IDs
    // Alternatively, could create separate event_team_members table
    members: jsonb("members").$type<string[]>().notNull(), // Array of user IDs
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    eventIdx: index("event_teams_event_idx").on(table.eventId),
  })
);

/**
 * NOTES TABLE SCHEMA
 * Personal and clan notes for tactical planning
 */
export const notes = pgTable(
  "notes",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    content: text("content").notNull(), // Markdown content
    category: varchar("category", { length: 50 }), // tactic, intel, coordination
    // Ownership
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clanId: varchar("clan_id").references(() => clans.id, {
      onDelete: "cascade",
    }), // Optional: clan note
    eventId: varchar("event_id").references(() => events.id, {
      onDelete: "set null",
    }), // Optional: note linked to event
    // Tags as JSON array
    tags: jsonb("tags").$type<string[]>(),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("notes_user_idx").on(table.userId),
    clanIdx: index("notes_clan_idx").on(table.clanId),
    eventIdx: index("notes_event_idx").on(table.eventId),
  })
);

/**
 * MATCH RESULTS TABLE SCHEMA
 * Results of completed matches/events
 */
export const matchResults = pgTable(
  "match_results",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    eventId: varchar("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    // Teams (could reference event_teams or store as JSON)
    team1Id: varchar("team1_id").references(() => eventTeams.id, {
      onDelete: "set null",
    }),
    team2Id: varchar("team2_id").references(() => eventTeams.id, {
      onDelete: "set null",
    }),
    winnerId: varchar("winner_id").references(() => eventTeams.id, {
      onDelete: "set null",
    }),
    // Scores and stats
    team1Score: integer("team1_score"),
    team2Score: integer("team2_score"),
    stats: jsonb("stats").$type<Record<string, unknown>>(), // Detailed match statistics
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    eventIdx: index("match_results_event_idx").on(table.eventId),
  })
);

/**
 * USER STATS TABLE SCHEMA
 * Aggregated user statistics
 */
export const userStats = pgTable(
  "user_stats",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    kdRatio: integer("kd_ratio").default(0), // Kill/Death ratio * 100 (to avoid decimals)
    wins: integer("wins").default(0).notNull(),
    losses: integer("losses").default(0).notNull(),
    eventsParticipated: integer("events_participated").default(0).notNull(),
    // Timestamps
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("user_stats_user_idx").on(table.userId),
  })
);

/**
 * PERMISSIONS TABLE SCHEMA
 * System permissions that can be assigned to users
 */
export const permissions = pgTable(
  "permissions",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    name: varchar("name", { length: 100 }).notNull().unique(), // e.g., "events.create", "users.ban", "admin.access"
    description: text("description"),
    category: varchar("category", { length: 50 }), // "events", "users", "admin", "content", etc.
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("permissions_name_idx").on(table.name),
    categoryIdx: index("permissions_category_idx").on(table.category),
  })
);

/**
 * USER PERMISSIONS TABLE SCHEMA
 * Many-to-many relationship between users and permissions
 * Allows granular permission control beyond roles
 */
export const userPermissions = pgTable(
  "user_permissions",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    permissionId: varchar("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    // Optional: grant/revoke tracking
    grantedBy: varchar("granted_by")
      .references(() => users.id, { onDelete: "set null" }),
    grantedAt: timestamp("granted_at").defaultNow().notNull(),
  },
  (table) => ({
    userPermissionIdx: index("user_permissions_user_permission_idx").on(
      table.userId,
      table.permissionId
    ),
    userIdx: index("user_permissions_user_idx").on(table.userId),
  })
);

/**
 * ROLE PERMISSIONS TABLE SCHEMA
 * Default permissions for each role
 * Can be overridden by user-specific permissions
 */
export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    role: userRoleEnum("role").notNull(),
    permissionId: varchar("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => ({
    rolePermissionIdx: index("role_permissions_role_permission_idx").on(
      table.role,
      table.permissionId
    ),
  })
);

/**
 * AUDIT LOGS TABLE SCHEMA
 * Logs all admin actions for audit trail
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    // Who performed the action
    userId: varchar("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    // What action was performed
    action: varchar("action", { length: 100 }).notNull(), // e.g., "user_banned", "event_created", "role_changed"
    // What resource was affected
    resourceType: varchar("resource_type", { length: 50 }), // "user", "event", "clan", etc.
    resourceId: varchar("resource_id"), // ID of the affected resource
    // Additional details
    details: jsonb("details").$type<Record<string, unknown>>(), // Additional context
    ipAddress: varchar("ip_address", { length: 45 }), // IPv4 or IPv6
    userAgent: text("user_agent"),
    // Timestamp
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("audit_logs_user_idx").on(table.userId),
    actionIdx: index("audit_logs_action_idx").on(table.action),
    resourceIdx: index("audit_logs_resource_idx").on(
      table.resourceType,
      table.resourceId
    ),
    createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
  })
);

/**
 * PAST EVENTS HIGHLIGHTS TABLE SCHEMA
 * Featured past events displayed on homepage
 * Admins can create, edit, and manage these highlights
 */
export const pastEventHighlights = pgTable(
  "past_event_highlights",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    // Link to original event (optional - can be standalone highlight)
    eventId: varchar("event_id").references(() => events.id, {
      onDelete: "set null",
    }),
    // Highlight content
    title: text("title").notNull(),
    description: text("description"),
    // Media
    imageUrl: text("image_url"), // URL to image in Supabase Storage
    videoUrl: text("video_url"), // Optional video URL
    // Display settings
    accentColor: varchar("accent_color", { length: 20 }), // rose, violet, cyan, amber, etc.
    isFeatured: boolean("is_featured").default(false).notNull(),
    displayOrder: integer("display_order").default(0).notNull(), // For sorting on homepage
    // Metadata
    eventDate: timestamp("event_date"), // Date of the original event
    tags: jsonb("tags").$type<string[]>(), // Tags for filtering/categorization
    // Admin tracking
    createdBy: varchar("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    eventIdx: index("past_event_highlights_event_idx").on(table.eventId),
    featuredIdx: index("past_event_highlights_featured_idx").on(table.isFeatured),
    orderIdx: index("past_event_highlights_order_idx").on(table.displayOrder),
  })
);

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  displayName: true,
  bio: true,
  steamId: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  type: true,
  gameMode: true,
  startDate: true,
  endDate: true,
  server: true,
  map: true,
  maxParticipants: true,
  isPublic: true,
  registrationOpen: true,
});

export const insertClanSchema = createInsertSchema(clans).pick({
  name: true,
  tag: true,
  description: true,
});

// TypeScript types derived from schemas
// TypeScript types derived from schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type InsertClan = z.infer<typeof insertClanSchema>;
export type Clan = typeof clans.$inferSelect;

/**
 * DRIZZLE RELATIONS
 * Define relationships between tables for easier queries
 */
export const usersRelations = relations(users, ({ many, one }) => ({
  organizedEvents: many(events),
  clanMemberships: many(clanMembers),
  eventRegistrations: many(eventRegistrations),
  notes: many(notes),
  stats: one(userStats, {
    fields: [users.id],
    references: [userStats.userId],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  registrations: many(eventRegistrations),
  teams: many(eventTeams),
  notes: many(notes),
  matchResults: many(matchResults),
}));

export const clansRelations = relations(clans, ({ one, many }) => ({
  leader: one(users, {
    fields: [clans.leaderId],
    references: [users.id],
  }),
  members: many(clanMembers),
  eventRegistrations: many(eventRegistrations),
  notes: many(notes),
}));

export const clanMembersRelations = relations(clanMembers, ({ one }) => ({
  clan: one(clans, {
    fields: [clanMembers.clanId],
    references: [clans.id],
  }),
  user: one(users, {
    fields: [clanMembers.userId],
    references: [users.id],
  }),
}));

export const eventRegistrationsRelations = relations(
  eventRegistrations,
  ({ one }) => ({
    event: one(events, {
      fields: [eventRegistrations.eventId],
      references: [events.id],
    }),
    user: one(users, {
      fields: [eventRegistrations.userId],
      references: [users.id],
    }),
    clan: one(clans, {
      fields: [eventRegistrations.clanId],
      references: [clans.id],
    }),
  })
);

export const eventTeamsRelations = relations(eventTeams, ({ one }) => ({
  event: one(events, {
    fields: [eventTeams.eventId],
    references: [events.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  clan: one(clans, {
    fields: [notes.clanId],
    references: [clans.id],
  }),
  event: one(events, {
    fields: [notes.eventId],
    references: [events.id],
  }),
}));

export const matchResultsRelations = relations(matchResults, ({ one }) => ({
  event: one(events, {
    fields: [matchResults.eventId],
    references: [events.id],
  }),
  team1: one(eventTeams, {
    fields: [matchResults.team1Id],
    references: [eventTeams.id],
  }),
  team2: one(eventTeams, {
    fields: [matchResults.team2Id],
    references: [eventTeams.id],
  }),
  winner: one(eventTeams, {
    fields: [matchResults.winnerId],
    references: [eventTeams.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

export const pastEventHighlightsRelations = relations(
  pastEventHighlights,
  ({ one }) => ({
    event: one(events, {
      fields: [pastEventHighlights.eventId],
      references: [events.id],
    }),
    creator: one(users, {
      fields: [pastEventHighlights.createdBy],
      references: [users.id],
    }),
  })
);

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  userPermissions: many(userPermissions),
  rolePermissions: many(rolePermissions),
}));

export const userPermissionsRelations = relations(
  userPermissions,
  ({ one }) => ({
    user: one(users, {
      fields: [userPermissions.userId],
      references: [users.id],
    }),
    permission: one(permissions, {
      fields: [userPermissions.permissionId],
      references: [permissions.id],
    }),
    grantedByUser: one(users, {
      fields: [userPermissions.grantedBy],
      references: [users.id],
    }),
  })
);

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  })
);

/**
 * LEGACY INTERFACES
 * These interfaces are used by existing frontend code
 * Keep them for backward compatibility
 */

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
 * EVENT INTERFACE (Legacy)
 * Represents a scheduled match, scrim, or training session
 * Note: This is a legacy interface. Use the Event type from Drizzle schema for new code.
 */
export interface EventInterface {
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
