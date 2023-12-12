import { redirect } from "next/navigation";

interface AdminLessonPageProps {
  params: { id: string };
}

export default function AdminLessonPage({ params }: AdminLessonPageProps) {
  redirect(`/admin/lessons/${params.id}/sections`);
}
