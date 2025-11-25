"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth/oauth";
import { Link } from "@/i18n/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthButton() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error("Error checking session:", error);
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Force a page refresh to update server-side state after sign in
      if (session && (_event === "SIGNED_IN" || _event === "TOKEN_REFRESHED")) {
        // Small delay to ensure cookies are set
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });

    // Also check session periodically (in case onAuthStateChange doesn't fire)
    const interval = setInterval(() => {
      checkSession();
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // signOut already handles redirect
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <Button variant="default" size="sm" disabled className="gap-2">
        <LogIn className="h-4 w-4" />
        {t("signIn")}
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            {t("dashboard")}
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          {t("signOut")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <LogIn className="h-4 w-4" />
        {t("signIn")}
      </Button>
      <AuthModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

