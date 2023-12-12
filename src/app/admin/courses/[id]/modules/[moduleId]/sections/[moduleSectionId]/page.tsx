"use client";

import { EditModuleSectionForm, ModuleSectionId } from "@/lib/ModuleSections";

interface AdminCourseModuleSectionPageProps {
  params: { moduleSectionId: string };
}

export default function AdminCourseModuleSectionPage({
  params,
}: AdminCourseModuleSectionPageProps) {
  return (
    <EditModuleSectionForm id={params.moduleSectionId as ModuleSectionId} />
  );
}
