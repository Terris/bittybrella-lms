"use client";

import { EditLessonSectionForm, LessonSectionId } from "@/lib/LessonSections";

interface AdminCourseLessonSectionPageProps {
  params: { lessonSectionId: string };
}

export default function AdminCourseLessonSectionPage({
  params,
}: AdminCourseLessonSectionPageProps) {
  return (
    <EditLessonSectionForm id={params.lessonSectionId as LessonSectionId} />
  );
}
