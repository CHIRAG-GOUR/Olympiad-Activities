"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, FileQuestion, RotateCcw, ArrowLeft, WifiOff, type LucideIcon } from "lucide-react";
import { AmbientField } from "@/components/ui/AmbientField";

/**
 * Recovery surfaces.
 *
 * A failed load keeps the person on the page they asked for and offers a way forward —
 * normally Retry — instead of sending them somewhere else. `StatusPanel` fills the screen
 * (used outside the console shell: exam, score paper, not-found); `InlineStatus` sits inside
 * a console page.
 */

export type StatusTone = "error" | "notfound" | "offline";

export interface StatusAction {
  label: string;
  onClick?: () => void;
  href?: string;
  primary?: boolean;
  disabled?: boolean;
}

const ICONS: Record<StatusTone, LucideIcon> = {
  error: AlertTriangle,
  notfound: FileQuestion,
  offline: WifiOff,
};

function ActionButton({ action }: { action: StatusAction }) {
  const cls = action.primary
    ? "bg-[#2468B2] text-white hover:bg-[#1C5190]"
    : "bg-white text-[#182338] border border-[#D7DFEA] hover:bg-[#EAF2FC]";
  const content = (
    <>
      {action.primary ? <RotateCcw className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
      <span>{action.label}</span>
    </>
  );
  const base = `inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-[13.5px] font-semibold transition-colors disabled:opacity-60 ${cls}`;
  if (action.href) {
    return (
      <Link href={action.href} className={base}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" onClick={action.onClick} disabled={action.disabled} className={base}>
      {content}
    </button>
  );
}

function Body({
  tone,
  title,
  message,
  actions,
}: {
  tone: StatusTone;
  title: string;
  message: string;
  actions: StatusAction[];
}) {
  const Icon = ICONS[tone];
  return (
    <div className="w-full max-w-[460px] text-center bg-white/80 backdrop-blur-sm border border-white/80 rounded-2xl shadow-[0_1px_0_0_rgba(255,255,255,0.7)_inset,0_14px_40px_-16px_rgba(38,45,90,0.22)] p-6 sm:p-8">
      <span
        className={`w-12 h-12 mx-auto rounded-xl grid place-items-center ${
          tone === "notfound" ? "bg-[#2468B2]/10 text-[#2468B2]" : "bg-[#F29A38]/15 text-[#B4701F]"
        }`}
      >
        <Icon className="w-6 h-6" strokeWidth={2.1} />
      </span>
      <h1 className="mt-5 text-[19px] font-bold tracking-[-0.01em] text-[#182338]">{title}</h1>
      <p className="mt-2 text-[13.5px] text-[#667085] leading-relaxed">{message}</p>
      {actions.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-center gap-2.5">
          {actions.map((a) => (
            <ActionButton key={a.label} action={a} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StatusPanel(props: {
  tone?: StatusTone;
  title: string;
  message: string;
  actions?: StatusAction[];
}) {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6 font-sans">
      <AmbientField />
      <Body tone={props.tone ?? "error"} title={props.title} message={props.message} actions={props.actions ?? []} />
    </div>
  );
}

export function InlineStatus(props: {
  tone?: StatusTone;
  title: string;
  message: string;
  actions?: StatusAction[];
}) {
  return (
    <div className="flex items-center justify-center py-10 px-2">
      <Body tone={props.tone ?? "error"} title={props.title} message={props.message} actions={props.actions ?? []} />
    </div>
  );
}
