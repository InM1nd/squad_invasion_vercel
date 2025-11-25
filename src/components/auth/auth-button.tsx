"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth/oauth";
import { Link } from "@/i18n/navigation";

export function AuthButton() {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    // Extract locale from pathname
    const locale = pathname.split("/")[1] || "ru";

    return (
      <div className="flex items-center gap-2">
        <Link href={`/${locale}/dashboard`}>
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

