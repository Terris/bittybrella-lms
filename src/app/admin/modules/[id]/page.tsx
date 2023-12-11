import { redirect } from "next/navigation";

interface AdminModulePageProps {
  params: { id: string };
}

export default function AdminModulePage({ params }: AdminModulePageProps) {
  redirect(`/admin/modules/${params.id}/sections`);
}
