import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { updateSession } from "./src/lib/supabase/middleware";
import { NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: routing.localePrefix,
});

export default async function middleware(request: NextRequest) {
  // Update Supabase session
  const supabaseResponse = await updateSession(request);

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

