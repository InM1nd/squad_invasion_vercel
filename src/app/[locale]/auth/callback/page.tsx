import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authenticating...",
  description: "Completing authentication",
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string; next?: string; error?: string }>;
};

export default async function AuthCallbackPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const { code, next, error: errorParam } = await searchParams;

  if (errorParam) {
    redirect(`/${locale}/auth/login?error=${encodeURIComponent(errorParam)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      redirect(
        `/${locale}/auth/login?error=${encodeURIComponent(error.message)}`
      );
    }

    // Redirect to the page user was trying to access, or home
    const redirectTo = next ? decodeURIComponent(next) : `/${locale}`;
    redirect(redirectTo);
  }

  // If no code, redirect to login
  redirect(`/${locale}/auth/login`);
}

