import { createNavigation } from "next-intl/navigation";
import { localePrefix, pathnames } from "./routing";
import { locales } from "./locales";

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  localePrefix,
  pathnames,
});

