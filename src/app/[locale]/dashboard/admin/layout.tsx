import type { ReactNode } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return <AdminGuard>{children}</AdminGuard>;
}

