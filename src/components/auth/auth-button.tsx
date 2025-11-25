"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";

export function AuthButton() {
  const t = useTranslations("auth");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <LogIn className="h-4 w-4" />
        {t("signIn")}
      </Button>
      <AuthModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

