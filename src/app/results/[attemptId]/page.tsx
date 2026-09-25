import ExamResultClient from "./ExamResultClient";

export function generateStaticParams() {
  return [{ attemptId: "demo" }];
}

export default function Page({ params }: { params: Promise<{ attemptId: string }> }) {
  return <ExamResultClient params={params} />;
}
