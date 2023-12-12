import { redirect } from "next/navigation";

interface AdminLessonPageProps {
  params: { id: string };
}

// We have a lesson ID, but no section ID, so redirect to the lesson sections page
export default function AdminLessonPage({ params }: AdminLessonPageProps) {
  redirect(`/admin/lessons/${params.id}/sections`);
}
