import React from "react";
import { AdminLayoutClient } from "@/app/admin/AdminLayoutClient";

export const metadata = {
  title: "My Examinations | Olympiad Digital Examination",
};

/** Candidates use the same shell; navigation and the guard restrict what they can open. */
export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
