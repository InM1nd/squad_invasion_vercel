"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Ban, Shield } from "lucide-react";
import { canGrantAdminRights } from "@/lib/auth/permissions";

interface UserData {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  role: string;
  rating: number;
  is_banned: boolean;
  banned_until: string | null;
  ban_reason: string | null;
  created_at: string;
}

interface UserEditFormProps {
  userId: string;
}

export function UserEditForm({ userId }: UserEditFormProps) {
  const router = useRouter();
  const t = useTranslations("dashboard.admin.users.edit");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({
    username: "",
    display_name: "",
    bio: "",
    role: "user",
    rating: 1000,
    is_banned: false,
    banned_until: null,
    ban_reason: null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch current user role
        const roleResponse = await fetch("/api/user/role");
        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          setCurrentUserRole(roleData.role);
        }

        // Fetch user data
        const response = await fetch(`/api/admin/users/${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user");
        }

        const data = await response.json();
        setFormData({
          username: data.user.username || "",
          display_name: data.user.display_name || "",
          bio: data.user.bio || "",
          role: data.user.role || "user",
          rating: data.user.rating || 1000,
          is_banned: data.user.is_banned || false,
          banned_until: data.user.banned_until || null,
          ban_reason: data.user.ban_reason || null,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      // Redirect back to users list
      router.push("/dashboard/admin/users");
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const canChangeAdminRole = currentUserRole && canGrantAdminRights({ 
    id: "", 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    role: currentUserRole as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">{t("usernameLabel")} *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder={t("usernamePlaceholder")}
              required
            />
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="display_name">{t("displayNameLabel")}</Label>
            <Input
              id="display_name"
              value={formData.display_name || ""}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value || null })}
              placeholder={t("displayNamePlaceholder")}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">{t("bioLabel")}</Label>
            <Textarea
              id="bio"
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value || null })}
              placeholder={t("bioPlaceholder")}
              rows={4}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">{t("roleLabel")} *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={!canChangeAdminRole && (formData.role === "admin" || formData.role === "super_admin")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">{t("roleUser")}</SelectItem>
                <SelectItem value="squad_leader">{t("roleSquadLeader")}</SelectItem>
                <SelectItem value="event_admin">{t("roleEventAdmin")}</SelectItem>
                <SelectItem value="admin" disabled={!canChangeAdminRole}>{t("roleAdmin")}</SelectItem>
                <SelectItem value="super_admin" disabled={!canChangeAdminRole}>{t("roleSuperAdmin")}</SelectItem>
              </SelectContent>
            </Select>
            {!canChangeAdminRole && (formData.role === "admin" || formData.role === "super_admin") && (
              <p className="text-xs text-muted-foreground">{t("roleChangeRestricted")}</p>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">{t("ratingLabel")}</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5000"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 1000 })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="h-5 w-5" />
            {t("banSection")}
          </CardTitle>
          <CardDescription>{t("banDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Is Banned */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_banned"
              checked={formData.is_banned}
              onChange={(e) => setFormData({ ...formData, is_banned: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="is_banned" className="cursor-pointer">
              {t("isBannedLabel")}
            </Label>
          </div>

          {/* Banned Until */}
          {formData.is_banned && (
            <>
              <div className="space-y-2">
                <Label htmlFor="banned_until">{t("bannedUntilLabel")}</Label>
                <Input
                  id="banned_until"
                  type="datetime-local"
                  value={formData.banned_until ? new Date(formData.banned_until).toISOString().slice(0, 16) : ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      banned_until: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">{t("bannedUntilHint")}</p>
              </div>

              {/* Ban Reason */}
              <div className="space-y-2">
                <Label htmlFor="ban_reason">{t("banReasonLabel")}</Label>
                <Textarea
                  id="ban_reason"
                  value={formData.ban_reason || ""}
                  onChange={(e) => setFormData({ ...formData, ban_reason: e.target.value || null })}
                  placeholder={t("banReasonPlaceholder")}
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/users")}
          disabled={saving}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("saving")}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t("save")}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

