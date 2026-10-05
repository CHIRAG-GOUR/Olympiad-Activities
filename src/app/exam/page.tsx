"use client";

import ExamSessionClient from "./ExamSessionClient";
import { RecordIdPage } from "@/components/routing/RecordIdPage";

export default function Page() {
  return <RecordIdPage loadingLabel="Loading the examination paper" render={(id) => <ExamSessionClient examId={id} />} />;
}
