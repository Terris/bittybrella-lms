import { redirect } from "next/navigation";

interface AdminModulePageProps {
  params: { id: string; moduleId: string };
}

export default function AdminCourseModulesPage({
  params,
}: AdminModulePageProps) {
  redirect(`/admin/courses/${params.id}/modules/${params.moduleId}/sections`);
}
