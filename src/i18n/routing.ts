import type { Pathnames } from "next-intl/navigation";
import type { LocalePrefix } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

export const localePrefix: LocalePrefix<typeof locales> = "always";

export const pathnames = {
  "/": "/",
  "/rules": "/rules",
} satisfies Pathnames<typeof locales>;

export const routing = {
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
};

