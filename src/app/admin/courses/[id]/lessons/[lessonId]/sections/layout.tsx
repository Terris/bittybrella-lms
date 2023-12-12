"use client";
import { useLessonSections } from "@/lib/LessonSections";
import { LessonId } from "@/lib/Lessons";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminCourseLessonSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { id, lessonId, lessonSectionId } = useParams();

  const { lessonSections } = useLessonSections({
    lessonId: lessonId as LessonId,
  });

  useEffect(() => {
    if (!lessonSections || lessonSections.length === 0) return;
    if (!lessonSectionId) {
      router.replace(
        `/admin/courses/${id}/lessons/${lessonId}/sections/${lessonSections[0]._id}`
      );
    }
  }, [id, router, lessonSections, lessonSectionId, lessonId]);

  if (!id || (id && !lessonId)) return null;
  return <>{children}</>;
}
