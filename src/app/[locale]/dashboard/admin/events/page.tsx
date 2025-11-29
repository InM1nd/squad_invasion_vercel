"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { EventsList } from "@/components/admin/events/events-list";
import { EventsCalendar } from "@/components/admin/events/events-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";

export default function AdminEventsPage() {
  const t = useTranslations("dashboard.admin.events");
  const [view, setView] = useState<"list" | "calendar">("calendar");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")}>
        <TabsList>
          <TabsTrigger value="calendar">
            <Calendar className="mr-2 h-4 w-4" />
            {t("calendar.view")}
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            {t("list.view")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calendar" className="mt-6">
          <EventsCalendar />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <EventsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

