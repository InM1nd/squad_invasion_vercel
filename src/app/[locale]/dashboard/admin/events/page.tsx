"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminEventsPage() {
  const t = useTranslations("dashboard.admin.events");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("comingSoon")}</CardTitle>
          <CardDescription>{t("comingSoonDescription")}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

