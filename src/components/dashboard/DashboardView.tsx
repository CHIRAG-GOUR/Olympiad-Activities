"use client";

import React, { useState, useEffect, useMemo } from "react";
import { examRepository, questionRepository, attemptRepository, userRepository } from "@/repositories";
import { Exam } from "@/types/exam";
import { ExamAttempt } from "@/types/attempt";
import { Question } from "@/types/question";
import { UserProfile } from "@/lib/auth/rbac";
import { useAuth } from "@/context/AuthContext";
import { Card, SectionHeading } from "@/components/ui/primitives";
import {
  DashboardHero,
  MetricRow,
  SyllabusGrid,
  ExaminationList,
  LivePanel,
  AnalyticsGrid,
  ResultsLedger,
  ContinueExamCard,
  NextExamCard,
  StudentProgress,
  EmptyState,
  type MetricCard,
} from "@/components/dashboard/DashboardSections";
import { ActivityMiniPreview } from "@/components/dashboard/ActivityMiniPreview";
import {
  buildSectionInsights,
  buildActivityPreviews,
  buildExamInsights,
  buildScoreDistribution,
  buildParticipationTrend,
  buildDifficultyMix,
  buildLiveCompletion,
  interactionKindFor,
  greetingFor,
  firstName,
  toneForIndex,
  type LiveSession,
} from "@/lib/dashboard/insights";
import {
  Layers,
  FileCheck2,
  MousePointerClick,
  Trophy,
  GraduationCap,
  Radio,
  BarChart3,
} from "lucide-react";

const KIND_LABEL: Record<string, string> = {
  rotate: "Rotate & inspect",
  plot: "Place & plot",
  arrange: "Arrange & sort",
  simulate: "Run a simulation",
  construct: "Construct a figure",
  measure: "Measure & read off",
};

export default function DashboardView() {
  const { role, user } = useAuth();

  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [exList, attList, qList, uList, liveSessions] = await Promise.all([
          examRepository.listExams(),
          attemptRepository.listAttempts(),
          questionRepository.listQuestions(),
          userRepository.listUsers(),
          (async () => {
            try {
              const { idbClient } = await import("@/services/persistence/indexeddb");
              return await idbClient.getAll<LiveSession>("sessions");
            } catch {
              return [] as LiveSession[];
            }
          })(),
        ]);
        if (cancelled) return;
        setExams(exList);
        setAttempts(attList);
        setQuestions(qList);
        setUsers(uList);
        setSessions(liveSessions);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Derivations (all from real repository data) ───────── */

  const sectionInsights = useMemo(
    () => buildSectionInsights(questions, attempts),
    [questions, attempts]
  );
  const examInsights = useMemo(
    () => buildExamInsights(exams, attempts, sessions, questions.length),
    [exams, attempts, sessions, questions.length]
  );
  const previews = useMemo(() => buildActivityPreviews(questions, 4), [questions]);
  const previewQuestions = useMemo(
    () =>
      previews
        .map((p) => questions.find((q) => (q.questionId || q.id) === p.questionId))
        .filter((q): q is Question => Boolean(q)),
    [previews, questions]
  );

  const questionCountByExam = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of exams) map[e.id] = e.questionIds.length || e.totalQuestions || questions.length;
    return map;
  }, [exams, questions.length]);

  const liveCount = useMemo(
    () => sessions.filter((s) => s.status === "in_progress").length,
    [sessions]
  );
  const totalActivities = useMemo(
    () => sectionInsights.reduce((sum, s) => sum + s.activityCount, 0),
    [sectionInsights]
  );
  const studentCount = useMemo(() => {
    const registered = users.filter((u) => u.role === "STUDENT").length;
    const withAttempts = new Set(attempts.map((a) => a.student?.studentId).filter(Boolean)).size;
    return Math.max(registered, withAttempts);
  }, [users, attempts]);

  const scoreDistribution = useMemo(() => buildScoreDistribution(attempts), [attempts]);
  const participation = useMemo(() => buildParticipationTrend(attempts), [attempts]);
  const difficultyMix = useMemo(() => buildDifficultyMix(questions), [questions]);
  const liveCompletion = useMemo(
    () => buildLiveCompletion(sessions, questionCountByExam),
    [sessions, questionCountByExam]
  );

  const sectionPoints = useMemo(
    () =>
      sectionInsights
        .filter((s) => s.accuracy !== null)
        .map((s, i) => ({ label: s.title, value: s.accuracy as number, tone: toneForIndex(i) })),
    [sectionInsights]
  );

  const avgAccuracy = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
    : null;

  const greeting = greetingFor();
  const name = firstName(user?.name);
  const primaryExamId = exams[0]?.id;

  /* ── Activity showcase — real components, read-only ────── */

  const isStaff = role === "SUPER_ADMIN" || role === "TEACHER";

  const activityShowcase = previewQuestions.length > 0 && (
    <section>
      <SectionHeading
        icon={MousePointerClick}
        title="Explore interactive activities"
        description={
          isStaff
            ? "Live previews of the real activities — the student manipulates these, and the manipulation itself produces the answer."
            : "A preview of the interactions waiting in your paper."
        }
        action={isStaff ? { label: "Activity library", href: "/admin/activities" } : undefined}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {previewQuestions.map((q) => (
          <ActivityMiniPreview
            key={q.id}
            question={q}
            kind={interactionKindFor(q)}
            examId={primaryExamId}
            label={KIND_LABEL[interactionKindFor(q)] || q.section || "Interactive activity"}
          />
        ))}
      </div>
    </section>
  );

  /* ── Student view ───────────────────────────────────────── */

  if (role === "STUDENT") {
    const resumable = sessions
      .filter((s) => s.status === "in_progress")
      .sort((a, b) => new Date(b.lastSavedAt).getTime() - new Date(a.lastSavedAt).getTime())[0];

    const nextExam = exams.find((e) => e.status !== "Archived") || exams[0];
    // Only this candidate's own records — never fall back to the whole cohort.
    const myAttempts = attempts.filter(
      (a) => a.student?.name?.trim().toLowerCase() === (user?.name || "").trim().toLowerCase()
    );
    const myAvg = myAttempts.length
      ? Math.round(myAttempts.reduce((s, a) => s + a.percentage, 0) / myAttempts.length)
      : null;

    const studentMetrics: MetricCard[] = [
      {
        label: "Activities waiting",
        value: totalActivities,
        hint: "Every question is hands-on",
        tone: "#2468B2",
        toneSoft: "#EAF2FC",
        icon: MousePointerClick,
        progress: questions.length ? (totalActivities / questions.length) * 100 : 0,
      },
      {
        label: "Questions",
        value: questions.length,
        hint: `${sectionInsights.length} syllabus sections`,
        tone: "#8067D9",
        toneSoft: "#F0EDFC",
        icon: Layers,
        donut: difficultyMix,
      },
      {
        label: "Papers completed",
        value: myAttempts.length,
        hint: myAttempts.length ? "Marked and available" : "None submitted yet",
        tone: "#55B987",
        toneSoft: "#EAF7F1",
        icon: Trophy,
        dots: { filled: myAttempts.length, total: Math.max(myAttempts.length, exams.length, 1) },
      },
      {
        label: "Average accuracy",
        value: myAvg !== null ? `${myAvg}%` : "—",
        hint: myAvg !== null ? "Across your papers" : "Awaiting your first result",
        tone: "#F29A38",
        toneSoft: "#FDF0E3",
        icon: BarChart3,
        spark: myAttempts.slice().reverse().map((a) => a.percentage),
      },
    ];

    return (
      <div className="space-y-6 sm:space-y-8 animate-rise-in">
        <DashboardHero
          greeting={greeting}
          name={name}
          roleLine="Your Olympiad examination desk"
          blurb="Every question here is an activity you manipulate — rotate a solid, plot a point, run a simulation — and your work produces the answer."
          facts={[
            { value: totalActivities, label: "Activities waiting", tone: "#2468B2" },
            { value: questions.length, label: "Questions in your paper", tone: "#8067D9" },
            { value: myAttempts.length, label: "Papers completed", tone: "#55B987" },
          ]}
          primary={
            nextExam
              ? {
                  label: resumable ? "Continue examination" : "Begin examination",
                  href: `/exam/${resumable?.examId ?? nextExam.id}`,
                }
              : undefined
          }
        />

        <MetricRow cards={studentMetrics} />

        {resumable ? (
          <ContinueExamCard
            session={resumable}
            totalQuestions={questionCountByExam[resumable.examId] || questions.length}
          />
        ) : nextExam ? (
          <NextExamCard
            title={nextExam.title}
            grade={nextExam.grade}
            questionCount={nextExam.questionIds.length || nextExam.totalQuestions || questions.length}
            durationMinutes={nextExam.durationMinutes}
            href={`/exam/${nextExam.id}`}
          />
        ) : (
          <Card>
            <EmptyState
              kind="exams"
              title="No examination available yet"
              description="Your paper will appear here as soon as it is published."
            />
          </Card>
        )}

        <section>
          <SectionHeading
            icon={Layers}
            title="Your interactive Olympiad"
            description="Every section of the paper is built from activities, simulations and puzzles."
          />
          <SyllabusGrid sections={sectionInsights} />
        </section>

        {activityShowcase}

        <section>
          <SectionHeading icon={Trophy} title="Your progress" />
          <StudentProgress attempts={myAttempts} />
        </section>

        {myAttempts.length > 0 && (
          <section>
            <SectionHeading
              title="Your results"
              description="Open a record for the full question-by-question report."
            />
            <ResultsLedger attempts={myAttempts} limit={5} />
          </section>
        )}
      </div>
    );
  }

  /* ── Teacher / administrator view ───────────────────────── */

  const isAdmin = role === "SUPER_ADMIN";

  const metrics: MetricCard[] = [
    {
      label: "Examinations",
      value: examInsights.length,
      hint: `${examInsights.filter((e) => e.exam.status !== "Archived").length} published`,
      tone: "#2468B2",
      toneSoft: "#EAF2FC",
      icon: FileCheck2,
      spark: participation.map((p) => p.value),
    },
    {
      label: "Candidates",
      value: studentCount,
      hint: liveCount > 0 ? `${liveCount} solving right now` : "None currently solving",
      tone: "#59B6DE",
      toneSoft: "#E8F4FB",
      icon: GraduationCap,
      dots: { filled: attempts.length, total: Math.max(studentCount, attempts.length, 1) },
    },
    {
      label: "Interactive bank",
      value: totalActivities,
      hint: `${questions.length} questions · ${
        questions.length ? Math.round((totalActivities / questions.length) * 100) : 0
      }% interactive`,
      tone: "#8067D9",
      toneSoft: "#F0EDFC",
      icon: MousePointerClick,
      donut: difficultyMix,
    },
    {
      label: "Papers marked",
      value: attempts.length,
      hint: avgAccuracy !== null ? `${avgAccuracy}% average accuracy` : "No graded attempts yet",
      tone: "#55B987",
      toneSoft: "#EAF7F1",
      icon: Trophy,
      progress: avgAccuracy ?? 0,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-rise-in">
      <DashboardHero
        greeting={greeting}
        name={name}
        roleLine={isAdmin ? "Your Olympiad examination centre" : "Your examination centre"}
        blurb="Manage examinations, monitor candidates as they work, and explore the interactive question library behind every paper."
        facts={[
          {
            value: examInsights.length,
            label: examInsights.length === 1 ? "Examination" : "Examinations",
            tone: "#2468B2",
          },
          { value: studentCount, label: "Candidates on roll", tone: "#59B6DE" },
          { value: totalActivities, label: "Interactive activities", tone: "#8067D9" },
        ]}
        primary={{
          label: "Open examination",
          href: primaryExamId ? `/exam/${primaryExamId}` : "/admin/exams",
        }}
        secondary={{ label: "Activity library", href: "/admin/activities" }}
      />

      <MetricRow cards={metrics} />

      <section>
        <SectionHeading
          icon={Layers}
          title="Your interactive Olympiad"
          description="Every question is designed as an activity, simulation, puzzle or interactive challenge."
          action={{ label: "Question bank", href: "/admin/question-bank" }}
        />
        <SyllabusGrid sections={sectionInsights} />
      </section>

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7 xl:col-span-8 min-w-0">
          <SectionHeading
            icon={FileCheck2}
            title="Active examinations"
            description="Participation and results per paper."
            action={{ label: "All examinations", href: "/admin/exams" }}
          />
          <ExaminationList exams={examInsights} />
        </section>

        <section className="lg:col-span-5 xl:col-span-4 min-w-0">
          <SectionHeading
            icon={Radio}
            title="Live examination"
            description={
              liveCompletion
                ? `${liveCompletion.answered} of ${liveCompletion.capacity} questions answered`
                : "Refreshed when this page loads."
            }
          />
          <LivePanel sessions={sessions} totalByExam={questionCountByExam} />
        </section>
      </div>

      {activityShowcase}

      <section>
        <SectionHeading
          icon={BarChart3}
          title="Analytics"
          description="Measured from graded attempts and the live question bank — nothing is estimated."
          action={{ label: "Full analytics", href: "/admin/analytics" }}
        />
        <AnalyticsGrid
          sectionPoints={sectionPoints}
          scoreDistribution={scoreDistribution}
          participation={participation}
          difficultyMix={difficultyMix}
          attemptCount={attempts.length}
        />
      </section>

      <section>
        <SectionHeading
          title="Recent examination records"
          description={
            studentCount > 0
              ? `${studentCount} ${studentCount === 1 ? "candidate" : "candidates"} on roll.`
              : "Records are entered automatically on submission."
          }
          action={{ label: "Results ledger", href: "/admin/results" }}
        />
        <ResultsLedger attempts={attempts} />
      </section>

      {loading && (
        <p className="text-center text-[12.5px] text-[#77839A] py-2">Loading examination data…</p>
      )}
    </div>
  );
}
