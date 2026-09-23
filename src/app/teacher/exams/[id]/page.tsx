"use client";

import ExamDetailScreen from "@/features/ExamDetailScreen";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ExamDetailScreen params={params} />;
}
