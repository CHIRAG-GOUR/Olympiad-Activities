"use client";

import ExamDetailScreen from "@/features/ExamDetailScreen";
import { RecordIdPage } from "@/components/routing/RecordIdPage";

export default function Page() {
  return <RecordIdPage loadingLabel="Opening the examination" render={(id) => <ExamDetailScreen examId={id} />} />;
}
