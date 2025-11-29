import type { LocalePrefix } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

export const localePrefix: LocalePrefix<typeof locales> = "always" as const;

export const pathnames = {
  "/": "/",
  "/rules": "/rules",
  "/roadmap": "/roadmap",
  "/dashboard": "/dashboard",
} as const;

export const routing = {
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
};

