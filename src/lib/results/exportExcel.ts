"use client";

import type { ExamAttempt } from "@/types/attempt";
import type { Exam } from "@/types/exam";
import { classSummary, questionStats, sectionStats, formatSeconds, type CountPolicy } from "./analysis";

/**
 * Downloads the class results as an Excel workbook:
 *   • Results           — one row per counted attempt
 *   • Question Analysis — per question: correct / wrong / left, average time, common wrong answer
 *   • Sections          — average marks per section
 *   • Summary           — class averages, highest, lowest, pass rate
 */
export async function downloadResultsWorkbook(opts: {
  attempts: ExamAttempt[];
  exams: Exam[];
  questionText: Map<string, string>;
  policy: CountPolicy;
  fileLabel: string;
}): Promise<void> {
  const XLSX = await import("xlsx");
  const examTitle = new Map(opts.exams.map((e) => [e.id, e.title]));
  const policyLabel = { latest: "Latest attempt per student", best: "Best attempt per student", all: "All attempts" }[opts.policy];

  const results = opts.attempts
    .slice()
    .sort((a, b) => (a.examTitle || "").localeCompare(b.examTitle || "") || (a.student?.name || "").localeCompare(b.student?.name || ""))
    .map((a) => ({
      Student: a.student?.name || "",
      "Roll No.": a.student?.rollNumber || "",
      Class: a.student?.grade ?? "",
      Section: a.student?.section || "",
      School: a.student?.schoolName || "",
      Exam: a.examTitle,
      "Exam Code": a.examCode,
      Attempt: a.attemptNumber || 1,
      Marks: a.totalMarks,
      "Max Marks": a.maximumMarks,
      "Percent (%)": a.percentage,
      Correct: a.correctCount ?? a.questionEvaluations?.filter((e) => e.isCorrect).length ?? "",
      Wrong: a.wrongCount ?? "",
      "Not Attempted": a.unansweredCount ?? "",
      Result: a.isPassed ? "Pass" : "Review",
      "Time Taken": formatSeconds(a.totalTimeSpentSeconds || 0),
      "Tab Switches": a.integrity?.tabSwitches ?? 0,
      "Full-screen Exits": a.integrity?.fullscreenExits ?? 0,
      Submitted: a.submittedAt ? new Date(a.submittedAt).toLocaleString() : "",
      "Submitted By": a.submissionType === "auto_timeout" ? "Time ran out" : "Student",
    }));

  const questions = questionStats(opts.attempts).map((q) => ({
    Exam: examTitle.get(q.examId) || q.examId,
    "Q No.": q.questionNumber,
    Section: q.section,
    Question: opts.questionText.get(q.questionId) || "",
    "Correct (%)": q.correctPercent,
    Correct: q.correct,
    Wrong: q.wrong,
    "Not Attempted": q.unanswered,
    "Missed (%)": q.missedPercent,
    "Avg Time": formatSeconds(q.averageTimeSeconds),
    "Most Common Wrong Answer": q.commonWrongAnswer ? `${q.commonWrongAnswer.answer} (${q.commonWrongAnswer.count} students)` : "",
  }));

  const sections = sectionStats(opts.attempts).map((s) => ({
    Exam: examTitle.get(s.examId) || s.examId,
    Section: s.section,
    Questions: s.questions,
    "Max Marks": s.maxMarks,
    "Average Marks": s.averageMarks,
    "Average (%)": s.averagePercent,
  }));

  const sum = classSummary(opts.attempts);
  const summary = [
    { Measure: "Counting", Value: policyLabel },
    { Measure: "Students", Value: sum.students },
    { Measure: "Attempts counted", Value: sum.attempts },
    { Measure: "Average marks", Value: sum.averageMarks },
    { Measure: "Average (%)", Value: sum.averagePercent },
    { Measure: "Highest (%)", Value: sum.highestPercent },
    { Measure: "Lowest (%)", Value: sum.lowestPercent },
    { Measure: "Pass rate (%)", Value: sum.passRate },
    { Measure: "Average time (min)", Value: sum.averageTimeMinutes },
    { Measure: "Attempts with tab switches / full-screen exits", Value: sum.flaggedForFocus },
    { Measure: "Exported", Value: new Date().toLocaleString() },
  ];

  const wb = XLSX.utils.book_new();
  const add = (rows: object[], name: string, widths: number[]) => {
    const ws = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: "No data for the current filters." }]);
    ws["!cols"] = widths.map((wch) => ({ wch }));
    XLSX.utils.book_append_sheet(wb, ws, name);
  };
  add(summary, "Summary", [44, 30]);
  add(results, "Results", [24, 12, 7, 8, 26, 36, 18, 8, 7, 9, 10, 8, 7, 12, 8, 11, 12, 15, 22, 13]);
  add(questions, "Question Analysis", [36, 6, 22, 60, 11, 8, 7, 12, 10, 9, 26]);
  add(sections, "Sections", [36, 26, 10, 10, 14, 11]);

  const safe = opts.fileLabel.replace(/[^a-zA-Z0-9 _-]+/g, "").trim().replace(/\s+/g, "_") || "Results";
  XLSX.writeFile(wb, `${safe}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
