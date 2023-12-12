import { Text } from "@/lib/ui";

interface AdminAssessmentQuestionPageProps {
  params: { id: string; questionId: string };
}

export default function AdminAssessmentQuestionPage({
  params,
}: AdminAssessmentQuestionPageProps) {
  return (
    <Text>To Do: insert editor here. Question ID: {params.questionId}</Text>
  );
}
