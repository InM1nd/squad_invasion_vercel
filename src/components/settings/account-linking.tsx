"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { signInWithOAuth, type OAuthProvider } from "@/lib/auth/oauth";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Identity {
  provider: string;
  id: string;
}

interface AccountInfo {
  provider: string;
  connected: boolean;
  id?: string;
  username?: string;
  displayName?: string;
}

export function AccountLinking() {
  const [accounts, setAccounts] = useState<AccountInfo[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const t = useTranslations("dashboard.settings");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for error in URL
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      console.error("Account linking error:", error);
      // Clear error from URL after a delay
      setTimeout(() => {
        router.replace("/dashboard/settings" as any);
      }, 3000);
    }
  }, [searchParams, router]);

  useEffect(() => {
    async function fetchUserData() {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        setUser(currentUser);
        
        // Get user data from users table
        const { data: data } = await supabase
          .from("users")
          .select("discord_id, steam_id, google_id, username, display_name")
          .eq("id", currentUser.id)
          .single();

        setUserData(data);

        // Check connected providers
        const identities: Identity[] = currentUser.identities || [];
        const providers = new Set(identities.map((id: Identity) => id.provider));
        
        // Get Discord username from user metadata or identities
        const discordIdentity = identities.find((id: Identity) => id.provider === "discord");
        const discordUsername = currentUser.user_metadata?.preferred_username || 
                               currentUser.user_metadata?.username ||
                               currentUser.user_metadata?.full_name ||
                               currentUser.user_metadata?.name;
        
        // Get Google username from user metadata or identities
        const googleIdentity = identities.find((id: Identity) => id.provider === "google");
        const googleUsername = currentUser.user_metadata?.name ||
                              currentUser.user_metadata?.full_name ||
                              currentUser.user_metadata?.email?.split("@")[0];
        
        // Get Steam display name from users table
        const steamDisplayName = data?.display_name || 
                                (data?.steam_id ? `Steam User ${data.steam_id}` : undefined);
        
        // For Steam, check both identities and users table
        // Steam uses custom flow, so identity might not be in identities array
        const steamConnected = providers.has("steam") || !!data?.steam_id;
        
        console.log("Account linking check:", {
          identities: identities.map(id => ({ provider: id.provider, id: id.id })),
          providers: Array.from(providers),
          userData: {
            discord_id: data?.discord_id,
            steam_id: data?.steam_id,
            google_id: data?.google_id,
          },
          steamConnected,
        });
        
        setAccounts([
          {
            provider: "discord",
            connected: providers.has("discord") || !!data?.discord_id,
            id: data?.discord_id || discordIdentity?.id,
            username: discordUsername,
            displayName: discordUsername,
          },
          {
            provider: "google",
            connected: providers.has("google") || !!data?.google_id,
            id: data?.google_id || googleIdentity?.id,
            username: googleUsername,
            displayName: googleUsername,
          },
          {
            provider: "steam",
            connected: false, // Steam is disabled
            id: data?.steam_id || identities.find((id: Identity) => id.provider === "steam")?.id,
            username: data?.steam_id,
            displayName: steamDisplayName,
          },
        ]);
      }
    }

    fetchUserData();
    
    // Refresh data when window gains focus (after OAuth redirect)
    const handleFocus = () => {
      fetchUserData();
    };
    
    // Also refresh when URL changes (after OAuth callback)
    const checkUrlChange = () => {
      const currentUrl = window.location.href;
      if (currentUrl.includes("/dashboard/settings")) {
        fetchUserData();
      }
    };
    
    window.addEventListener("focus", handleFocus);
    
    // Check for URL changes periodically (for OAuth redirects)
    const urlCheckInterval = setInterval(() => {
      checkUrlChange();
    }, 1000);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(urlCheckInterval);
    };
  }, []);

  const handleLink = async (provider: OAuthProvider) => {
    setLoading(provider);
    try {
      // signInWithOAuth will automatically use the correct base URL
      await signInWithOAuth(provider, undefined, locale);
      // The redirect will happen automatically
    } catch (error) {
      console.error(`Error linking ${provider}:`, error);
      setLoading(null);
    }
  };

  const accountConfig = [
    {
      provider: "discord" as const,
      name: "Discord",
      icon: "💬",
      description: t("accounts.discord.description"),
    },
    {
      provider: "google" as const,
      name: "Google",
      icon: "🔍",
      description: t("accounts.google.description"),
    },
    {
      provider: "steam" as const,
      name: "Steam",
      icon: "🎮",
      description: t("accounts.steam.description"),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">{t("accounts.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("accounts.description")}</p>
      </div>
      
      <div className="space-y-3">
        {accountConfig.map((config) => {
          const account = accounts.find((a) => a.provider === config.provider);
          const isConnected = account?.connected || false;
          const isLoading = loading === config.provider;

          return (
            <Card key={config.provider}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{config.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{config.name}</div>
                    {isConnected && account?.displayName ? (
                      <div className="text-sm text-muted-foreground">
                        {account.displayName}
                        {account.id && config.provider === "steam" && (
                          <span className="ml-2 text-xs opacity-70">({account.id})</span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {config.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {config.provider === "steam" ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-xs">(soon)</span>
                    </div>
                  ) : isConnected ? (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      <span>{t("accounts.connected")}</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLink(config.provider)}
                      disabled={isLoading || !!loading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("accounts.connecting")}
                        </>
                      ) : (
                        t("accounts.connect")
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

