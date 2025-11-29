import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { updateSession } from "./src/lib/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: routing.localePrefix,
});

export default async function middleware(request: NextRequest) {
  // Update Supabase session first (this sets cookies)
  const supabaseResponse = await updateSession(request);

  // Apply internationalization middleware to the Supabase response
  // This ensures cookies from Supabase are preserved
  const intlResponse = intlMiddleware(request);
  
  // Merge cookies from both responses
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

