"use client";

import { EditLessonSectionForm, LessonSectionId } from "@/lib/LessonSections";

interface AdminLessonSectionPageProps {
  params: { sectionId: string };
}

export default function AdminLessonSectionPage({
  params,
}: AdminLessonSectionPageProps) {
  return <EditLessonSectionForm id={params.sectionId as LessonSectionId} />;
}
