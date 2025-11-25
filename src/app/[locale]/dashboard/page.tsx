import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}`);
  }

  // Get user data from users table
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("profile.title")}
            </CardTitle>
            <CardDescription>{t("profile.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("profile.email")}</p>
              <p className="text-sm">{user.email || t("profile.noEmail")}</p>
            </div>
            {userData?.username && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("profile.username")}</p>
                <p className="text-sm">{userData.username}</p>
              </div>
            )}
            {userData?.steam_id && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("profile.steamId")}</p>
                <p className="text-sm">{userData.steam_id}</p>
              </div>
            )}
            {userData?.discord_id && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("profile.discordId")}</p>
                <p className="text-sm">{userData.discord_id}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("stats.title")}</CardTitle>
            <CardDescription>{t("stats.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t("stats.comingSoon")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

