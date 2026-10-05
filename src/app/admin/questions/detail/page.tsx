"use client";

import QuestionDetailScreen from "@/features/QuestionDetailScreen";
import { RecordIdPage } from "@/components/routing/RecordIdPage";

export default function Page() {
  return <RecordIdPage loadingLabel="Opening the question" render={(id) => <QuestionDetailScreen questionId={id} />} />;
}
