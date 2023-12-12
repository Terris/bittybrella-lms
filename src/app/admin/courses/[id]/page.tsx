import { redirect } from "next/navigation";

interface AdminCoursePageProps {
  params: { id: string };
}

export default function AdminCoursePage({ params }: AdminCoursePageProps) {
  redirect(`/admin/courses/${params.id}/lessons`);
}
