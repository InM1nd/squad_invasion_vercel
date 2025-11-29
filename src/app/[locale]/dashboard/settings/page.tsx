import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSelector } from "@/components/settings/language-selector";
import { ThemeSelector } from "@/components/settings/theme-selector";
import { AccountLinking } from "@/components/settings/account-linking";
import { Settings } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard.settings" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("general.title")}</CardTitle>
          <CardDescription>{t("general.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <LanguageSelector />
          <div className="border-t pt-6">
            <ThemeSelector />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("accounts.title")}</CardTitle>
          <CardDescription>{t("accounts.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountLinking />
        </CardContent>
      </Card>
    </div>
  );
}

