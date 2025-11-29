import type { LocalePrefix } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

export const localePrefix: LocalePrefix<typeof locales> = "always" as const;

export const pathnames = {
  "/": "/",
  "/rules": "/rules",
  "/roadmap": "/roadmap",
  "/dashboard": "/dashboard",
  "/dashboard/profile": "/dashboard/profile",
  "/dashboard/settings": "/dashboard/settings",
  "/dashboard/events": "/dashboard/events",
  "/dashboard/squad": "/dashboard/squad",
  "/dashboard/squad/notes": "/dashboard/squad/notes",
  "/dashboard/admin/users": "/dashboard/admin/users",
  "/dashboard/admin/events": "/dashboard/admin/events",
  "/dashboard/admin/events/create": "/dashboard/admin/events/create",
  "/dashboard/admin/system": "/dashboard/admin/system",
} as const;

export const routing = {
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
};

