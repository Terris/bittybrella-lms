"use client";

import { EditLessonSectionForm, LessonSectionId } from "@/lib/LessonSections";

interface AdminLessonSectionPageProps {
  params: { sectionId: string };
}

export default function AdminLessonSectionPage({
  params,
}: AdminLessonSectionPageProps) {
  console.log("params", params);
  return <EditLessonSectionForm id={params.sectionId as LessonSectionId} />;
}
