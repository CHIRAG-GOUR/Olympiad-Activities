"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/lib/auth/rbac";
import {
  navigationFor,
  sectionForPath,
  CATEGORY_LABELS,
  type SectionId,
  type SectionCategory,
  type NavEntry,
} from "@/lib/auth/sections";
import { homeFor } from "@/lib/auth/roleRoutes";
import {
  LayoutDashboard,
  ClipboardList,
  CircleHelp,
  Library,
  GraduationCap,
  Users,
  RadioTower,
  Trophy,
  LineChart,
  Settings,
  Shapes,
  Upload,
  type LucideIcon,
} from "lucide-react";

/**
 * Primary navigation, as a rail down the left of the application window.
 *
 * Entries are grouped into semantic categories for staff, with active route tracking
 * that respects subroute parent relationships and live monitoring badges.
 */

const SECTION_ICON: Record<SectionId, LucideIcon> = {
  dashboard: LayoutDashboard,
  exams: ClipboardList,
  activities: Shapes,
  questions: CircleHelp,
  questionBank: Library,
  subjects: Library,
  students: GraduationCap,
  teachers: Users,
  liveMonitor: RadioTower,
  results: Trophy,
  analytics: LineChart,
  imports: Upload,
  settings: Settings,
};

const ROLE_STRAPLINE: Record<UserRole, string> = {
  SUPER_ADMIN: "Administration",
  TEACHER: "Teacher Centre",
  STUDENT: "My Olympiad",
};

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { activeRole } = useAuth();

  const items = navigationFor(activeRole);
  const home = homeFor(activeRole);
  const currentSection = sectionForPath(pathname);

  // Group items by category for staff roles
  const groupedItems = useMemo(() => {
    if (activeRole === "STUDENT") {
      return [{ category: "CORE" as SectionCategory, label: "", items }];
    }

    const order: SectionCategory[] = ["CORE", "ACADEMIC", "MONITORING", "PEOPLE", "SYSTEM"];
    const groups: { category: SectionCategory; label: string; items: NavEntry[] }[] = [];

    for (const cat of order) {
      const catItems = items.filter((i) => i.category === cat);
      if (catItems.length > 0) {
        groups.push({
          category: cat,
          label: CATEGORY_LABELS[cat],
          items: catItems,
        });
      }
    }

    return groups;
  }, [items, activeRole]);

  const isItemActive = (item: NavEntry) => {
    if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
      return true;
    }
    // Check if current route is a subroute belonging to this parent section
    if (currentSection?.parentSection === item.id) {
      return true;
    }
    return false;
  };

  return (
    <div className="h-full flex flex-col bg-white/45 border-r border-white/70">
      <Link
        href={home}
        onClick={onNavigate}
        className="h-16 shrink-0 flex items-center gap-2.5 px-4 group border-b border-white/60"
      >
        <span className="w-9 h-9 rounded-xl bg-[#2468B2] text-white grid place-items-center font-display font-bold text-lg shadow-subtle group-hover:bg-[#1C5190] transition-colors">
          Ω
        </span>
        <span className="leading-tight min-w-0">
          <span className="block text-[14px] font-bold text-[#182338] tracking-[-0.01em]">
            Olympiad
          </span>
          <span className="block text-[11px] text-[#77839A] font-medium truncate">
            {ROLE_STRAPLINE[activeRole]}
          </span>
        </span>
      </Link>

      <nav
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2.5 py-3 space-y-4"
        aria-label="Main"
      >
        {groupedItems.map((group, gIdx) => (
          <div key={group.category} className="space-y-0.5">
            {group.label && (
              <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8A95A6]">
                {group.label}
              </div>
            )}

            {group.items.map((item) => {
              const Icon = SECTION_ICON[item.id] ?? LayoutDashboard;
              const active = isItemActive(item);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center justify-between h-10 px-3 rounded-xl text-[13px] font-semibold transition-colors ${
                    active
                      ? "bg-[#EAF2FC] text-[#2468B2]"
                      : "text-[#667085] hover:text-[#182338] hover:bg-white/75"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition-opacity ${
                        active ? "bg-[#2468B2] opacity-100" : "opacity-0"
                      }`}
                    />
                    <Icon className="w-[17px] h-[17px] shrink-0" strokeWidth={2} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badgeKey === "live" && (
                    <span className="flex h-2 w-2 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="shrink-0 px-4 py-3 border-t border-white/60">
        <p className="text-[10.5px] text-[#77839A] leading-snug">
          Olympiad Digital Examination
        </p>
      </div>
    </div>
  );
}
