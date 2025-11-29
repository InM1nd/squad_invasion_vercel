"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/auth/permissions";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * Component that protects admin routes
 * Allows access for admin and super_admin roles
 * Redirects other users to dashboard
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAdminAccess() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      // Use API endpoint to get role (bypasses RLS)
      try {
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          const role = data.role as UserRole;
          
          // Admin and super_admin both have access to admin panel
          // Only super_admin can grant admin rights (checked separately)
          if (role === "admin" || role === "super_admin") {
            setIsAuthorized(true);
          } else {
            router.push("/dashboard");
          }
        } else {
          console.error("Failed to fetch user role");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push("/dashboard");
      }
    }

    checkAdminAccess();
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

