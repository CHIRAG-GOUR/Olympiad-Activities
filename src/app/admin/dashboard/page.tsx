"use client";

import React, { useState, useEffect, useMemo } from "react";
import { examRepository, questionRepository, attemptRepository, userRepository } from "@/repositories";
import { Exam } from "@/types/exam";
import { ExamAttempt } from "@/types/attempt";
import { Question } from "@/types/question";
import { UserProfile } from "@/lib/auth/rbac";
import { useAuth } from "@/context/AuthContext";
import { SectionHeading } from "@/components/ui/primitives";
import {
  DashboardHero,
  SyllabusGrid,
  ActivityPreviewRow,
  ExaminationList,
  LivePanel,
  ResultsLedger,
  ContinueExamCard,
  NextExamCard,
  StudentProgress,
} from "@/components/dashboard/DashboardSections";
import {
  buildSectionInsights,
  buildActivityPreviews,
  buildExamInsights,
  greetingFor,
  firstName,
  type LiveSession,
} from "@/lib/dashboard/insights";
import { Layers, FileCheck2, MousePointerClick, Trophy } from "lucide-react";

export default function DashboardPage() {
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
  const activityPreviews = useMemo(() => buildActivityPreviews(questions, 6), [questions]);
  const examInsights = useMemo(
    () => buildExamInsights(exams, attempts, sessions, questions.length),
    [exams, attempts, sessions, questions.length]
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

  const greeting = greetingFor();
  const name = firstName(user?.name);

  /* ── Student view ───────────────────────────────────────── */

  if (role === "STUDENT") {
    // Best-effort: the most recently saved unfinished paper on this device.
    const resumable = sessions
      .filter((s) => s.status === "in_progress")
      .sort((a, b) => new Date(b.lastSavedAt).getTime() - new Date(a.lastSavedAt).getTime())[0];

    const nextExam = exams.find((e) => e.status !== "Archived") || exams[0];
    // Only this candidate's own records — never fall back to the whole cohort.
    const shownAttempts = attempts.filter(
      (a) => a.student?.name?.trim().toLowerCase() === (user?.name || "").trim().toLowerCase()
    );

    return (
      <div className="space-y-8 animate-rise-in">
        <DashboardHero
          greeting={greeting}
          name={name}
          roleLine="Your Olympiad examination desk"
          facts={[
            { value: totalActivities, label: "Interactive activities waiting" },
            { value: questions.length, label: "Questions in your paper" },
            { value: shownAttempts.length, label: "Papers completed" },
          ]}
          primary={
            nextExam
              ? { label: resumable ? "Continue examination" : "Begin examination", href: `/exam/${resumable?.examId ?? nextExam.id}` }
              : undefined
          }
          secondary={{ label: "Open activity library", href: "/admin/activities" }}
        />

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
        ) : null}

        <section>
          <SectionHeading
            icon={Layers}
            title="Your interactive Olympiad"
            description="Every section of the paper is built from activities you manipulate, not options you tick."
          />
          <SyllabusGrid sections={sectionInsights} />
        </section>

        <section>
          <SectionHeading
            icon={MousePointerClick}
            title="What the questions feel like"
            description="A preview of the interactions waiting in your paper."
          />
          <ActivityPreviewRow previews={activityPreviews} />
        </section>

        <section>
          <SectionHeading icon={Trophy} title="Your progress" />
          <StudentProgress attempts={shownAttempts} />
        </section>

        {shownAttempts.length > 0 && (
          <section>
            <SectionHeading
              title="Your results"
              description="Open a record for the full question-by-question report."
            />
            <ResultsLedger attempts={shownAttempts} limit={5} />
          </section>
        )}
      </div>
    );
  }

  /* ── Teacher / administrator view ───────────────────────── */

  const isAdmin = role === "SUPER_ADMIN";

  return (
    <div className="space-y-8 animate-rise-in">
      <DashboardHero
        greeting={greeting}
        name={name}
        roleLine={isAdmin ? "Your Olympiad examination centre" : "Your examination centre"}
        facts={[
          { value: examInsights.length, label: examInsights.length === 1 ? "Examination configured" : "Examinations configured" },
          { value: liveCount, label: "Candidates solving now" },
          { value: totalActivities, label: "Activities ready to run" },
        ]}
        primary={{ label: "Open examination", href: exams[0] ? `/exam/${exams[0].id}` : "/admin/exams" }}
        secondary={{ label: "Activity library", href: "/admin/activities" }}
      />

      <section>
        <SectionHeading
          icon={Layers}
          title="Your interactive Olympiad"
          description="Each syllabus section, the activities behind it, and how candidates are performing."
          action={{ label: "Question bank", href: "/admin/question-bank" }}
        />
        <SyllabusGrid sections={sectionInsights} />
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <SectionHeading
            icon={FileCheck2}
            title="Active examinations"
            description="Participation and results per paper."
            action={{ label: "All examinations", href: "/admin/exams" }}
          />
          <ExaminationList exams={examInsights} />
        </section>

        <section className="lg:col-span-5">
          <SectionHeading title="Live now" description="Updated when this page loads." />
          <LivePanel sessions={sessions} totalByExam={questionCountByExam} />
        </section>
      </div>

      <section>
        <SectionHeading
          icon={MousePointerClick}
          title="Interactive activities"
          description="What makes a question here different from a multiple-choice paper."
          action={{ label: "Activity library", href: "/admin/activities" }}
        />
        <ActivityPreviewRow previews={activityPreviews} />
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
        <p className="text-center text-[12.5px] text-[#98A2B3] py-2">Loading examination data…</p>
      )}
    </div>
  );
}
