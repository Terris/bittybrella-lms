"use client";
import { useModuleSections } from "@/lib/ModuleSections";
import { ModuleId } from "@/lib/Modules";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminCourseModuleSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { id, moduleId, moduleSectionId } = useParams();

  const { moduleSections } = useModuleSections({
    moduleId: moduleId as ModuleId,
  });

  useEffect(() => {
    if (!moduleSections || moduleSections.length === 0) return;
    if (!moduleSectionId) {
      router.replace(
        `/admin/courses/${id}/modules/${moduleId}/sections/${moduleSections[0]._id}`
      );
    }
  }, [id, router, moduleSections, moduleSectionId, moduleId]);

  if (!id || (id && !moduleId)) return null;
  return <>{children}</>;
}
