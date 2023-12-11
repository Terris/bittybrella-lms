// import { redirect } from "next/navigation";

interface AdminAssessmentPageProps {
  params: { id: string };
}

export function AdminAssessmentPage({ params }: AdminAssessmentPageProps) {
  // redirect(`/admin/assessments/${params.id}/questions`);
  return <h1>Hello</h1>;
}
