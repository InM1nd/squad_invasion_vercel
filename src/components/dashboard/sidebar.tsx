"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, User, Settings, LogOut, Menu, X, Flame, Users, Calendar, Shield, UserCog, CalendarDays } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { signOut } from "@/lib/auth/oauth";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { isSuperAdmin } from "@/lib/auth/permissions";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const baseNavigationItems = [
  {
    href: "/dashboard",
    label: "dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/events",
    label: "events",
    icon: Calendar,
  },
  {
    href: "/dashboard/profile",
    label: "profile",
    icon: User,
  },
] as const;

const squadLeaderNavigationItems = [
  {
    href: "/dashboard/squad",
    label: "squad",
    icon: UserCog,
    squadLeaderOnly: true,
  },
  {
    href: "/dashboard/squad/notes",
    label: "notes",
    icon: Calendar,
    squadLeaderOnly: true,
  },
] as const;

const adminNavigationItems = [
  {
    href: "/dashboard/admin/users",
    label: "users",
    icon: Users,
    adminOnly: true,
  },
  {
    href: "/dashboard/admin/events",
    label: "adminEvents",
    icon: CalendarDays,
    adminOnly: true,
  },
  {
    href: "/dashboard/admin/system",
    label: "system",
    icon: Shield,
    adminOnly: true,
  },
] as const;

interface UserProfile {
  username: string;
  displayName: string | null;
  avatar: string | null;
  role: string;
  email: string | null;
}

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();
  const t = useTranslations("dashboard");

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch user profile (includes role)
        const profileResponse = await fetch("/api/user/profile");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData);
          setUserRole(profileData.role);
        } else {
          // Fallback to role-only endpoint
          const roleResponse = await fetch("/api/user/role");
          if (roleResponse.ok) {
            const roleData = await roleResponse.json();
            setUserRole(roleData.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show admin section for admin and super_admin
  const showAdminSection = userRole === "admin" || userRole === "super_admin";
  
  // Show squad leader section for squad_leader and higher roles
  const showSquadLeaderSection = userRole === "squad_leader" || 
                                  userRole === "event_admin" || 
                                  userRole === "admin" || 
                                  userRole === "super_admin";
  
  // Debug logging
  useEffect(() => {
    if (userRole) {
      console.log("Current user role:", userRole);
      console.log("Show admin section:", showAdminSection);
      console.log("Show squad leader section:", showSquadLeaderSection);
    }
  }, [userRole, showAdminSection, showSquadLeaderSection]);
  
  const navigationItems = [
    ...baseNavigationItems,
    ...(showSquadLeaderSection ? squadLeaderNavigationItems : []),
    ...(showAdminSection ? adminNavigationItems : []),
  ];

  // Format role for display
  const formatRole = (role: string | null): string => {
    if (!role) return "";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get user initials for avatar fallback
  const getUserInitials = (): string => {
    if (userProfile?.displayName) {
      return userProfile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (userProfile?.username) {
      return userProfile.username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6 border-b">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.4em] text-foreground transition-colors hover:text-primary"
          onClick={onItemClick}
        >
          <Flame className="h-4 w-4 text-primary" />
          <span className="font-semibold">BÜRN</span>
        </Link>
      </div>

      {/* User Profile Section */}
      {userProfile && (
        <div className="px-4 py-4 border-b">
          <Link
            href="/dashboard/profile"
            onClick={onItemClick}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile.avatar || undefined} alt={userProfile.displayName || userProfile.username} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {userProfile.displayName || userProfile.username}
              </p>
              {userRole && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {formatRole(userRole)}
                </Badge>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {baseNavigationItems.map((item) => {
          const Icon = item.icon;
          // Check if this item is active
          // An item is active if pathname exactly matches or starts with href + "/"
          // But we need to ensure that a shorter href doesn't match when a longer one should
          const exactMatch = pathname === item.href;
          const startsWith = pathname?.startsWith(item.href + "/");
          
          // Check if there's a longer href that also matches (if so, prefer the longer one)
          const hasLongerMatch = navigationItems.some(
            (otherItem) => 
              otherItem.href !== item.href && 
              otherItem.href.startsWith(item.href + "/") &&
              (pathname === otherItem.href || pathname?.startsWith(otherItem.href + "/"))
          );
          
          const isActive = (exactMatch || startsWith) && !hasLongerMatch;
          return (
            <Link
              key={item.href}
              href={item.href as any}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(`nav.${item.label}`)}</span>
            </Link>
          );
        })}

        {/* Squad Leader Section */}
        {showSquadLeaderSection ? (
          <>
            <div className="px-4 py-2 mt-4 mb-2">
              <div className="h-px bg-border" />
            </div>
            <div className="px-4 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("nav.squadLeader")}
              </h3>
            </div>
            {squadLeaderNavigationItems.map((item) => {
              const Icon = item.icon;
              const exactMatch = pathname === item.href;
              const startsWith = pathname?.startsWith(item.href + "/");
              
              const hasLongerMatch = navigationItems.some(
                (otherItem) => 
                  otherItem.href !== item.href && 
                  otherItem.href.startsWith(item.href + "/") &&
                  (pathname === otherItem.href || pathname?.startsWith(otherItem.href + "/"))
              );
              
              const isActive = (exactMatch || startsWith) && !hasLongerMatch;
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{t(`nav.${item.label}`)}</span>
                </Link>
              );
            })}
          </>
        ) : null}

        {/* Admin Section */}
        {showAdminSection ? (
          <>
            <div className="px-4 py-2 mt-4 mb-2">
              <div className="h-px bg-border" />
            </div>
            <div className="px-4 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("nav.admin")}
              </h3>
            </div>
            {adminNavigationItems.map((item) => {
              const Icon = item.icon;
              const exactMatch = pathname === item.href;
              const startsWith = pathname?.startsWith(item.href + "/");
              
              const hasLongerMatch = navigationItems.some(
                (otherItem) => 
                  otherItem.href !== item.href && 
                  otherItem.href.startsWith(item.href + "/") &&
                  (pathname === otherItem.href || pathname?.startsWith(otherItem.href + "/"))
              );
              
              const isActive = (exactMatch || startsWith) && !hasLongerMatch;
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{t(`nav.${item.label}`)}</span>
                </Link>
              );
            })}
          </>
        ) : null}
      </nav>

      {/* Settings and Sign Out */}
      <div className="px-4 py-4 border-t space-y-1">
        {/* Settings */}
        <Link
          href="/dashboard/settings"
          onClick={onItemClick}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full",
            pathname === "/dashboard/settings" || pathname?.startsWith("/dashboard/settings/")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>{t("nav.settings")}</span>
        </Link>

        {/* Sign Out */}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>{t("nav.signOut")}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:left-0 md:border-r md:bg-background">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent onItemClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}

