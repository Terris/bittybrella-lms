import { redirect } from "next/navigation";

interface AdminLessonPageProps {
  params: { id: string; lessonId: string };
}

export default function AdminCourseLessonsPage({
  params,
}: AdminLessonPageProps) {
  redirect(`/admin/courses/${params.id}/lessons/${params.lessonId}/sections`);
}
