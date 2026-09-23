"use client";

import React from "react";
import Link from "next/link";
import { Question } from "@/types/question";
import { getQuestionActivity } from "@/components/activities/ActivityRegistry";
import { InteractionMotif, type InteractionKind } from "@/components/ui/OlympiadArt";
import { ArrowUpRight } from "lucide-react";

/**
 * Live preview of a real activity.
 *
 * Rather than drawing a decorative stand-in, this mounts the actual registered activity
 * component for a real question, read-only and inert, rendered at double width and scaled
 * to half so it fills the frame exactly at any container size. What you see on the
 * dashboard is genuinely the activity the student will be handed.
 *
 * If an activity fails to mount for any reason, the boundary below falls back to the
 * interaction motif so one bad component can never take the dashboard down.
 */

class PreviewBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[ActivityPreview] activity failed to render in preview:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const noop = () => undefined;

export function ActivityMiniPreview({
  question,
  kind,
  examId,
  label,
}: {
  question: Question;
  kind: InteractionKind;
  examId?: string;
  label: string;
}) {
  const ActivityComponent =
    getQuestionActivity(question.id) || getQuestionActivity(question.questionId);

  const motifFallback = (
    <div className="absolute inset-0 grid place-items-center bg-[#F4F7FB]">
      <InteractionMotif kind={kind} className="w-24 h-20" />
    </div>
  );

  return (
    <article className="group relative bg-white border border-[#E1E7EF] rounded-2xl shadow-subtle overflow-hidden transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[2px] hover:shadow-lifted hover:border-[#C3D8EC]">
      {/* Frame: the activity is rendered at 200% width and scaled 50%, so it lands at
          exactly the card's width whatever the breakpoint. */}
      <div className="relative h-[176px] overflow-hidden bg-[#F4F7FB] border-b border-[#E1E7EF]">
        {ActivityComponent ? (
          <PreviewBoundary fallback={motifFallback}>
            <div
              className="w-[200%] origin-top-left scale-50 pointer-events-none select-none"
              aria-hidden
            >
              <ActivityComponent
                questionId={question.id}
                question={question}
                onChange={noop}
                readOnly
              />
            </div>
          </PreviewBoundary>
        ) : (
          motifFallback
        )}

        {/* Legibility wash at the bottom edge of the clipped frame */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F4F7FB] to-transparent" />
      </div>

      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[14px] font-bold text-[#182338] leading-snug truncate">
            {question.topic || question.chapter}
          </h3>
          <p className="text-[12.5px] text-[#667085] mt-0.5 truncate">{label}</p>
        </div>

        {examId && (
          <Link
            href={`/exam/${examId}`}
            className="shrink-0 inline-flex items-center gap-1 h-10 sm:h-8 px-2.5 rounded-lg text-[12.5px] font-semibold text-[#2468B2] hover:bg-[#EAF2FC] transition-colors"
          >
            Try it
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.4} />
          </Link>
        )}
      </div>
    </article>
  );
}
