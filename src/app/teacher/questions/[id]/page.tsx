"use client";

import QuestionDetailScreen from "@/features/QuestionDetailScreen";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <QuestionDetailScreen params={params} />;
}
