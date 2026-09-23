import React from "react";
import { AdminLayoutClient } from "@/app/admin/AdminLayoutClient";

export const metadata = {
  title: "Teacher Dashboard | Olympiad Digital Examination",
};

/** Teachers use the same console shell; the route guard inside it enforces access. */
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
