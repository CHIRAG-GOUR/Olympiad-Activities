"use client";

import React from "react";
import Link from "next/link";
import { Plus, Upload, Play, FileSpreadsheet, Sparkles } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

export function AdminHeader({ title, subtitle, actionButton }: AdminHeaderProps) {
  const ActionIcon = actionButton?.icon || Plus;

  return (
    <header className="bg-white border-b-2 border-[#D4E0C2] min-h-[76px] px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#547322]" />
          <h1 className="text-xl lg:text-[23px] font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-[13px] text-slate-600 font-semibold mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        <Link
          href="/"
          className="h-[42px] px-4 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-2 border-[#FDE68A] rounded-xl text-[13px] font-extrabold flex items-center gap-2 transition-all shadow-xs"
        >
          <Play className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
          <span>Launch Student Exam</span>
        </Link>

        <Link
          href="/admin/imports"
          className="h-[42px] px-4 bg-[#F4F7EE] hover:bg-[#EBF1E4] text-[#3E5519] border-2 border-[#D4E0C2] rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#547322]" />
          <span>Import Questions</span>
        </Link>

        {actionButton && (
          <Link
            href={actionButton.href}
            className="h-[42px] px-5 bg-[#547322] hover:bg-[#435C1B] text-white rounded-xl text-[14px] font-extrabold flex items-center gap-2 shadow-md shadow-[#547322]/20 transition-all"
          >
            <ActionIcon className="w-4 h-4" />
            <span>{actionButton.label}</span>
          </Link>
        )}
      </div>
    </header>
  );
}

