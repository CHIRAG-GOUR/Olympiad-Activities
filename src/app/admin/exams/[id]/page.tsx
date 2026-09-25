import ExamDetailScreen from "@/features/ExamDetailScreen";

export function generateStaticParams() {
  return [
    { id: "exam_imo_2024_g6_setb" },
    { id: "exam_imo_2018_g6_seta" },
  ];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ExamDetailScreen params={params} />;
}
