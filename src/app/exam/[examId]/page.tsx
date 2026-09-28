import ExamSessionClient from "./ExamSessionClient";

import { SEED_EXAMS } from "@/lib/seedData";

export function generateStaticParams() {
  return SEED_EXAMS.map((exam) => ({ examId: exam.id }));
}

export default function Page({ params }: { params: Promise<{ examId: string }> }) {
  return <ExamSessionClient params={params} />;
}
