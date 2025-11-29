"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { UserEditForm } from "@/components/admin/users/user-edit-form";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;
  const t = useTranslations("dashboard.admin.users.edit");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <UserEditForm userId={userId} />
    </div>
  );
}

