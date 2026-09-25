"use client";

import React from "react";
import Link from "next/link";
import { Plus, Play } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

/** Page header card — matches the dashboard's surface language. */
export function AdminHeader({ title, subtitle, actionButton }: AdminHeaderProps) {
  const ActionIcon = actionButton?.icon || Plus;

  return (
    <header className="bg-white/80 backdrop-blur-sm border border-white/80 shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_2px_10px_-4px_rgba(38,45,90,0.10)] rounded-2xl px-6 sm:px-7 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div className="min-w-0">
        <h1 className="text-[22px] sm:text-[24px] font-bold text-[#182338] tracking-[-0.02em] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13.5px] text-[#667085] mt-1.5 leading-relaxed max-w-2xl">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#E1E7EF] bg-white text-[13px] font-semibold text-[#182338] hover:bg-white/70 hover:border-[#C3D8EC] transition-colors"
        >
          <Play className="w-4 h-4 text-[#F29A38]" strokeWidth={2.2} />
          <span>Candidate portal</span>
        </Link>

        {actionButton && (
          <Link
            href={actionButton.href}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2468B2] text-white text-[13px] font-semibold hover:bg-[#1C5190] transition-colors shadow-subtle"
          >
            <ActionIcon className="w-4 h-4" />
            <span>{actionButton.label}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
