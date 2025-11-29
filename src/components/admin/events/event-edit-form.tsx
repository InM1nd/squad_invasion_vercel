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
import { Loader2, Calendar, MapPin, Users, Gamepad2, Upload, X, Image as ImageIcon } from "lucide-react";
import { SQUAD_MAPS } from "@/data/squad-maps";
import Image from "next/image";

interface EventFormData {
  title: string;
  description: string;
  type: "clan_war" | "scrim" | "tournament" | "training";
  game_mode: "invasion" | "territory_control" | "raas" | "aas";
  start_date: string;
  end_date?: string;
  server: string;
  map: string;
  map_image?: string;
  team1_name?: string;
  team1_image?: string;
  team2_name?: string;
  team2_image?: string;
  max_participants: number;
  is_public: boolean;
  registration_open: boolean;
  status?: string;
}

interface EventEditFormProps {
  eventId: string;
}

export function EventEditForm({ eventId }: EventEditFormProps) {
  const router = useRouter();
  const t = useTranslations("dashboard.admin.events");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    type: "scrim",
    game_mode: "invasion",
    start_date: "",
    server: "",
    map: "",
    max_participants: 50,
    is_public: true,
    registration_open: true,
    status: "upcoming",
  });

  const handleImageUpload = async (file: File, field: "map_image" | "team1_image" | "team2_image") => {
    try {
      setUploading(field);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "events");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setFormData((prev) => ({ ...prev, [field]: data.url }));
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = (field: "map_image" | "team1_image" | "team2_image") => {
    setFormData((prev) => ({ ...prev, [field]: undefined }));
  };

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch event");
        }

        const event = data.event;

        // Format dates for datetime-local input
        const startDate = new Date(event.start_date);
        const startDateLocal = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);

        const endDateLocal = event.end_date
          ? new Date(new Date(event.end_date).getTime() - new Date(event.end_date).getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16)
          : "";

        setFormData({
          title: event.title || "",
          description: event.description || "",
          type: event.type || "scrim",
          game_mode: event.game_mode || "invasion",
          start_date: startDateLocal,
          end_date: endDateLocal,
          server: event.server || "",
          map: event.map || "",
          map_image: event.map_image || undefined,
          team1_name: event.team1_name || undefined,
          team1_image: event.team1_image || undefined,
          team2_name: event.team2_name || undefined,
          team2_image: event.team2_image || undefined,
          max_participants: event.max_participants || 50,
          is_public: event.is_public !== undefined ? event.is_public : true,
          registration_open: event.registration_open !== undefined ? event.registration_open : true,
          status: event.status || "upcoming",
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      console.log("Updating event:", formData);

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API response:", response.status, data);

      if (!response.ok) {
        const errorMessage = data.error || data.details || "Failed to update event";
        console.error("Error response:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("Event updated successfully, redirecting...");
      router.push("/dashboard/admin/events");
      router.refresh();
    } catch (err) {
      console.error("Error updating event:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update event";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
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
          <CardTitle>{t("edit.title")}</CardTitle>
          <CardDescription>{t("edit.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t("create.titleLabel")} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t("create.titlePlaceholder")}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t("create.descriptionLabel")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t("create.descriptionPlaceholder")}
              rows={4}
            />
          </div>

          {/* Type and Game Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">{t("create.typeLabel")} *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: EventFormData["type"]) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clan_war">{t("create.typeClanWar")}</SelectItem>
                  <SelectItem value="scrim">{t("create.typeScrim")}</SelectItem>
                  <SelectItem value="tournament">{t("create.typeTournament")}</SelectItem>
                  <SelectItem value="training">{t("create.typeTraining")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="game_mode">{t("create.gameModeLabel")} *</Label>
              <Select
                value={formData.game_mode}
                onValueChange={(value: EventFormData["game_mode"]) =>
                  setFormData({ ...formData, game_mode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invasion">{t("create.gameModeInvasion")}</SelectItem>
                  <SelectItem value="territory_control">{t("create.gameModeTC")}</SelectItem>
                  <SelectItem value="raas">{t("create.gameModeRAAS")}</SelectItem>
                  <SelectItem value="aas">{t("create.gameModeAAS")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start_date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t("create.startDateLabel")} *
            </Label>
            <Input
              id="start_date"
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">{t("edit.statusLabel")}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">{t("status.upcoming")}</SelectItem>
                <SelectItem value="ongoing">{t("status.ongoing")}</SelectItem>
                <SelectItem value="completed">{t("status.completed")}</SelectItem>
                <SelectItem value="cancelled">{t("status.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Server and Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="server" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("create.serverLabel")}
              </Label>
              <Input
                id="server"
                value={formData.server}
                onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                placeholder={t("create.serverPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="map" className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                {t("create.mapLabel")}
              </Label>
              <Select
                value={formData.map}
                onValueChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    map: value,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("create.mapPlaceholder")} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {SQUAD_MAPS.map((map) => (
                    <SelectItem key={map.id} value={map.name}>
                      {map.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Map Image */}
          <div className="space-y-2">
            <Label>{t("create.mapImageLabel")}</Label>
            {formData.map_image ? (
              <div className="relative">
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={formData.map_image}
                    alt="Map"
                    fill
                    className="object-cover"
                    unoptimized={!formData.map_image.includes("supabase")}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleRemoveImage("map_image")}
                >
                  <X className="mr-2 h-4 w-4" />
                  {t("create.removeImage")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="map_image"
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
                >
                  <Upload className="h-4 w-4" />
                  {uploading === "map_image" ? t("create.uploading") : t("create.uploadMapImage")}
                </Label>
                <input
                  id="map_image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "map_image");
                  }}
                  disabled={uploading === "map_image"}
                />
              </div>
            )}
          </div>

          {/* Teams Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">{t("create.teamsSection")}</h3>
            
            {/* Team 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team1_name">{t("create.team1NameLabel")}</Label>
                <Input
                  id="team1_name"
                  value={formData.team1_name || ""}
                  onChange={(e) => setFormData({ ...formData, team1_name: e.target.value })}
                  placeholder={t("create.team1NamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("create.team1ImageLabel")}</Label>
                {formData.team1_image ? (
                  <div className="relative">
                    <div className="relative aspect-square w-full max-w-[150px] rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={formData.team1_image}
                        alt="Team 1"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleRemoveImage("team1_image")}
                    >
                      <X className="mr-2 h-4 w-4" />
                      {t("create.removeImage")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="team1_image"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
                    >
                      <Upload className="h-4 w-4" />
                      {uploading === "team1_image" ? t("create.uploading") : t("create.uploadImage")}
                    </Label>
                    <input
                      id="team1_image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "team1_image");
                      }}
                      disabled={uploading === "team1_image"}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Team 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team2_name">{t("create.team2NameLabel")}</Label>
                <Input
                  id="team2_name"
                  value={formData.team2_name || ""}
                  onChange={(e) => setFormData({ ...formData, team2_name: e.target.value })}
                  placeholder={t("create.team2NamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("create.team2ImageLabel")}</Label>
                {formData.team2_image ? (
                  <div className="relative">
                    <div className="relative aspect-square w-full max-w-[150px] rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={formData.team2_image}
                        alt="Team 2"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleRemoveImage("team2_image")}
                    >
                      <X className="mr-2 h-4 w-4" />
                      {t("create.removeImage")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Label
                      htmlFor="team2_image"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent"
                    >
                      <Upload className="h-4 w-4" />
                      {uploading === "team2_image" ? t("create.uploading") : t("create.uploadImage")}
                    </Label>
                    <input
                      id="team2_image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "team2_image");
                      }}
                      disabled={uploading === "team2_image"}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Max Participants */}
          <div className="space-y-2">
            <Label htmlFor="max_participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t("create.maxParticipantsLabel")}
            </Label>
            <Input
              id="max_participants"
              type="number"
              min="1"
              max="100"
              value={formData.max_participants}
              onChange={(e) =>
                setFormData({ ...formData, max_participants: parseInt(e.target.value) || 50 })
              }
            />
          </div>

          {/* Settings */}
          <div className="flex items-center gap-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_public" className="cursor-pointer">
                {t("create.isPublicLabel")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="registration_open"
                checked={formData.registration_open}
                onChange={(e) =>
                  setFormData({ ...formData, registration_open: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="registration_open" className="cursor-pointer">
                {t("create.registrationOpenLabel")}
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/events")}
          disabled={saving}
        >
          {t("edit.cancel")}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("edit.saving")}
            </>
          ) : (
            t("edit.submit")
          )}
        </Button>
      </div>
    </form>
  );
}

