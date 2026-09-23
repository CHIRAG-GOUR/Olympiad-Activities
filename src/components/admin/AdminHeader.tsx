"use client";

import React from "react";
import Link from "next/link";
import { Plus, Play, FileSpreadsheet } from "lucide-react";

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
    <header className="bg-white border border-[#E3E8EF] rounded-2xl shadow-subtle px-6 sm:px-7 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div className="min-w-0">
        <h1 className="text-[22px] sm:text-[24px] font-bold text-[#172033] tracking-[-0.02em] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13.5px] text-[#667085] mt-1.5 leading-relaxed max-w-2xl">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#E3E8EF] bg-white text-[13px] font-semibold text-[#172033] hover:bg-[#F6F8FB] hover:border-[#C2D4E8] transition-colors"
        >
          <Play className="w-4 h-4 text-[#F39A3D]" strokeWidth={2.2} />
          <span>Candidate portal</span>
        </Link>

        <Link
          href="/admin/imports"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#E3E8EF] bg-white text-[13px] font-semibold text-[#172033] hover:bg-[#F6F8FB] hover:border-[#C2D4E8] transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#2563A8]" strokeWidth={2.2} />
          <span>Import questions</span>
        </Link>

        {actionButton && (
          <Link
            href={actionButton.href}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-[#2563A8] text-white text-[13px] font-semibold hover:bg-[#1B4E88] transition-colors shadow-subtle"
          >
            <ActionIcon className="w-4 h-4" />
            <span>{actionButton.label}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
