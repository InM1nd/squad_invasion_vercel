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

    // Get initial session - check multiple times to catch session after redirect
    const checkSession = async (retryCount = 0) => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }
        
        console.log("Session check:", retryCount, session?.user?.id || "no user");
        
        if (session?.user) {
          setUser(session.user);
          setLoading(false);
          return true;
        } else if (retryCount < 5) {
          // Retry a few times in case cookies are still being set after redirect
          setTimeout(() => checkSession(retryCount + 1), 300);
          return false;
        } else {
          setUser(null);
          setLoading(false);
          return false;
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (retryCount < 5) {
          setTimeout(() => checkSession(retryCount + 1), 300);
        } else {
          setLoading(false);
        }
        return false;
      }
    };

    // Check if we're coming from auth callback (check URL)
    const isFromCallback = window.location.search.includes("code=") || 
                          window.location.pathname.includes("/auth/callback");
    
    if (isFromCallback) {
      // Wait a bit longer if coming from callback
      setTimeout(() => checkSession(), 500);
    } else {
      checkSession();
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.id);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Don't reload - let the callback page handle redirect
      // The session will be detected on next render
    });

    return () => {
      subscription.unsubscribe();
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
      <Button variant="default" size="sm" disabled className="gap-1.5 sm:gap-2">
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">{t("signIn")}</span>
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">{t("dashboard")}</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="gap-1.5 sm:gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{t("signOut")}</span>
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
        className="gap-1.5 sm:gap-2"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">{t("signIn")}</span>
      </Button>
      <AuthModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

