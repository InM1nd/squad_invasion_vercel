"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { EventEditForm } from "@/components/admin/events/event-edit-form";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const t = useTranslations("dashboard.admin.events");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("edit.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("edit.description")}</p>
      </div>

      <EventEditForm eventId={eventId} />
    </div>
  );
}

