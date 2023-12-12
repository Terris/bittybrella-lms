import { redirect } from "next/navigation";

interface AdminCoursePageProps {
  params: { id: string };
}
// We have a course id
// So we want to forward to the course lessons page (...course/[courseId]]/lessons)
export default function AdminCoursePage({ params }: AdminCoursePageProps) {
  redirect(`/admin/courses/${params.id}/lessons`);
}
