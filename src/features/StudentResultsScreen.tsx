"use client";

import React, { useEffect, useMemo, useState } from "react";
import { attemptRepository } from "@/repositories";
import { ExamAttempt } from "@/types/attempt";
import { useAuth } from "@/context/AuthContext";
import { visibleAttempts } from "@/lib/auth/dataAccess";
import { Card, SectionHeading, AccuracySeal, ScoreMark } from "@/components/ui/primitives";
import { EmptyState, ResultsLedger, StudentProgress } from "@/components/dashboard/DashboardSections";
import { BarSeries } from "@/components/ui/charts";
import { toneForIndex } from "@/lib/dashboard/insights";

/**
 * Candidate results.
 *
 * Every record shown is narrowed by the data-access layer to the signed-in candidate —
 * there is no cohort view here, and no other candidate's name can reach this screen.
 */
export default function StudentResultsScreen() {
  const { scope } = useAuth();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    attemptRepository
      .listAttempts()
      .then((a) => !cancelled && setAttempts(a))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const mine = useMemo(() => visibleAttempts(scope, attempts), [scope, attempts]);

  /** Section performance measured across this candidate's own papers only. */
  const sectionPoints = useMemo(() => {
    const agg = new Map<string, { correct: number; total: number }>();
    for (const a of mine) {
      for (const s of a.sectionScores || []) {
        const cur = agg.get(s.sectionTitle) || { correct: 0, total: 0 };
        cur.correct += s.questionsCorrect;
        cur.total += s.questionsTotal;
        agg.set(s.sectionTitle, cur);
      }
    }
    return Array.from(agg.entries()).map(([label, d], i) => ({
      label,
      value: d.total ? Math.round((d.correct / d.total) * 100) : 0,
      tone: toneForIndex(i),
    }));
  }, [mine]);

  if (loading) {
    return (
      <Card>
        <EmptyState kind="results" title="Loading your results…" />
      </Card>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-rise-in">
      <div>
        <h1 className="text-[24px] sm:text-[27px] font-bold tracking-[-0.02em]">My results</h1>
        <p className="mt-1.5 text-[13.5px] text-[#667085]">
          Your marked papers and how you performed across the syllabus.
        </p>
      </div>

      {mine.length === 0 ? (
        <Card>
          <EmptyState
            kind="results"
            title="No results yet"
            description="Finish an examination and your marked paper will appear here."
            action={{ label: "See available exams", href: "/student/exams" }}
          />
        </Card>
      ) : (
        <>
          <StudentProgress attempts={mine} />

          {sectionPoints.length > 0 && (
            <section>
              <SectionHeading
                title="Your performance by section"
                description="Accuracy across your own papers."
              />
              <Card solid className="p-5">
                <BarSeries points={sectionPoints} max={100} suffix="%" />
              </Card>
            </section>
          )}

          <section>
            <SectionHeading
              title="Your papers"
              description="Open a record for the full question-by-question report."
            />
            <ResultsLedger attempts={mine} limit={20} />
          </section>
        </>
      )}
    </div>
  );
}
