"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CourseLessonsNav, useCourseLessons } from "@/lib/CourseLessons";
import { CourseId } from "@/lib/Courses";
import { LessonSectionId } from "@/lib/LessonSections";
import { LessonId } from "@/lib/Lessons";

interface AdminCourseLessonLayoutProps {
  children: React.ReactNode;
}

export default function AdminAssessmentQuestionLayout({
  children,
}: AdminCourseLessonLayoutProps) {
  const router = useRouter();
  const { id, lessonId, lessonSectionId } = useParams();

  const { courseLessons } = useCourseLessons({
    courseId: id as CourseId,
  });

  useEffect(() => {
    if (!courseLessons || courseLessons.length === 0) return;
    if (!lessonId) {
      router.replace(
        `/admin/courses/${id}/lessons/${courseLessons[0].lessonId}`
      );
    }
  });

  if (!id) return null;

  return (
    <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
      <aside className="px-4 lg:w-1/4 lg:max-w-4xl lg:pl-8">
        <div className="sticky top-4">
          <CourseLessonsNav
            courseId={id as CourseId}
            lessonId={lessonId as LessonId}
            lessonSectionId={lessonSectionId as LessonSectionId}
          />
        </div>
      </aside>
      <div className="px-4  lg:pr-8">
        <div className="flex flex-col gap-4 max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
