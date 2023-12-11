import { redirect } from "next/navigation";

interface AdminAssessmentPageProps {
  params: { id: string };
}

export default function AdminAssessmentPage({
  params,
}: AdminAssessmentPageProps) {
  redirect(`/admin/assessments/${params.id}/questions`);
}
