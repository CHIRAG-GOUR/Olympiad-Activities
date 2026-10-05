"use client";

import ExamResultClient from "./ExamResultClient";
import { RecordIdPage } from "@/components/routing/RecordIdPage";

export default function Page() {
  return <RecordIdPage loadingLabel="Opening the score paper" render={(id) => <ExamResultClient attemptId={id} />} />;
}
