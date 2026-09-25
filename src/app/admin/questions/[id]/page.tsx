import QuestionDetailScreen from "@/features/QuestionDetailScreen";

export function generateStaticParams() {
  return [{ id: "new" }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <QuestionDetailScreen params={params} />;
}
