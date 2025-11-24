import { createLocalizedPathnamesNavigation } from "next-intl/navigation";
import type { Pathnames } from "next-intl/navigation";
import { defaultLocale, locales } from "./locales";

export const localePrefix = "always";

export const pathnames = {
  "/": "/",
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames,
    localePrefix,
  });

export const routing = {
  locales,
  defaultLocale,
  localePrefix,
  pathnames,
};

