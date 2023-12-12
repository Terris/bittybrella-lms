import { redirect } from "next/navigation";

interface AdminAssessmentPageProps {
  params: { id: string };
}

// We have an assessment ID, but no question ID, so redirect to the assessment questions page
export default function AdminAssessmentPage({
  params,
}: AdminAssessmentPageProps) {
  redirect(`/admin/assessments/${params.id}/questions`);
}
