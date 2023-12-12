import { redirect } from "next/navigation";

interface AdminLessonPageProps {
  params: { id: string; lessonId: string };
}

// We know we have a lesson id. Forward to .../sections
export default function AdminCourseLessonsPage({
  params,
}: AdminLessonPageProps) {
  redirect(`/admin/courses/${params.id}/lessons/${params.lessonId}/sections`);
}
