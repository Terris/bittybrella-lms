"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LessonId } from "@/lib/Lessons";
import {
  LessonSectionId,
  LessonSectionsNav,
  useLessonSections,
} from "@/lib/LessonSections";

interface AdminLessonSectionLayoutProps {
  children: React.ReactNode;
}

export default function AdminLessonSectionLayout({
  children,
}: AdminLessonSectionLayoutProps) {
  const router = useRouter();
  const { id, sectionId } = useParams();
  const { lessonSections } = useLessonSections({
    lessonId: id as LessonId,
  });

  useEffect(() => {
    if (!lessonSections || lessonSections.length === 0) return;
    if (!sectionId) {
      router.replace(`/admin/lessons/${id}/sections/${lessonSections[0]._id}`);
    }
  });

  if (!id) return null;

  return children;
}
