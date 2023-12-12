"use client";
import { useLessonSections } from "@/lib/LessonSections";
import { LessonId } from "@/lib/Lessons";
import { useConditionalForwarder } from "@/lib/hooks";
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

  useConditionalForwarder({
    skipCondition: !lessonSections || lessonSections.length === 0,
    forwardCondition: !lessonSectionId,
    forwardTo: `/admin/courses/${id}/lessons/${lessonId}/sections/${
      lessonSections?.[0]?._id ?? ""
    }`,
  });

  if (!id || (id && !lessonId)) return null;
  return <>{children}</>;
}
