import { Text } from "@/lib/ui";

interface AdminAssessmentQuestionPageProps {
  params: { id: string; questionId: string };
}

export default function AdminAssessmentQuestionPage({
  params,
}: AdminAssessmentQuestionPageProps) {
  return <Text>[the question editor goes here]</Text>;
}
