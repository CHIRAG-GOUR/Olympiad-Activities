import ExamSessionClient from "./ExamSessionClient";

export function generateStaticParams() {
  return [
    { examId: "exam_imo_2024_g6_setb" },
    { examId: "exam_imo_2018_g6_seta" },
    { examId: "exam_imo_2018_g6_seta_classic" },
    { examId: "exam_imo_g6_setb2" },
  ];
}

export default function Page({ params }: { params: Promise<{ examId: string }> }) {
  return <ExamSessionClient params={params} />;
}
