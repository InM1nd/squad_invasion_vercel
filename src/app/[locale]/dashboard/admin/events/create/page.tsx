"use client";

import { useTranslations } from "next-intl";
import { EventCreateForm } from "@/components/admin/events/event-create-form";

export default function CreateEventPage() {
  const t = useTranslations("dashboard.admin.events");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("create.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("create.description")}</p>
      </div>

      <EventCreateForm />
    </div>
  );
}

