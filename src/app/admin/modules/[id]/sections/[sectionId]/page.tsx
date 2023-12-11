"use client";

import { EditModuleSectionForm, ModuleSectionId } from "@/lib/ModuleSections";

interface AdminModuleSectionPageProps {
  params: { sectionId: string };
}

export default function AdminModuleSectionPage({
  params,
}: AdminModuleSectionPageProps) {
  return <EditModuleSectionForm id={params.sectionId as ModuleSectionId} />;
}
