import React from "react";
import { AdminLayoutClient } from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard | Olympiad Digital Examination",
  description: "Administrative console for managing digital Olympiad examinations, interactive questions, and live student monitoring.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
