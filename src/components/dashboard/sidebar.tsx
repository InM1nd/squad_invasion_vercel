"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, User, Settings, LogOut, Menu, X, Flame, Users, Calendar, Shield } from "lucide-react";
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
    href: "/dashboard/profile",
    label: "profile",
    icon: User,
  },
  {
    href: "/dashboard/settings",
    label: "settings",
    icon: Settings,
  },
];

const adminNavigationItems = [
  {
    href: "/dashboard/admin/users",
    label: "users",
    icon: Users,
    adminOnly: true,
  },
  {
    href: "/dashboard/admin/events",
    label: "events",
    icon: Calendar,
    adminOnly: true,
  },
  {
    href: "/dashboard/admin/system",
    label: "system",
    icon: Shield,
    adminOnly: true,
  },
];

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const t = useTranslations("dashboard");

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          console.log("User role from API:", data.role);
          setUserRole(data.role);
        } else {
          const errorData = await response.json();
          console.error("Error fetching user role from API:", errorData);
        }
      } catch (apiError) {
        console.error("Error fetching user role:", apiError);
      }
    }

    fetchUserRole();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const showAdminSection = userRole === "super_admin";
  
  // Debug logging
  useEffect(() => {
    if (userRole) {
      console.log("Current user role:", userRole);
      console.log("Show admin section:", showAdminSection);
    }
  }, [userRole, showAdminSection]);
  
  const navigationItems = [
    ...baseNavigationItems,
    ...(showAdminSection ? adminNavigationItems : []),
  ];

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
              href={item.href}
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
                  href={item.href}
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

      {/* Sign Out */}
      <div className="px-4 py-4 border-t">
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

