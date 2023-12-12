"use client";

import { useParams } from "next/navigation";
import { useCourseLessons } from "@/lib/CourseLessons";
import { CourseId } from "@/lib/Courses";
import { useConditionalForwarder } from "@/lib/hooks";

interface AdminCourseLessonLayoutProps {
  children: React.ReactNode;
}

// We have a course id, but no courseLesson id.
// Get the course's first courseLesson id and forward to .../lessons/[lessonId]
export default function AdminAssessmentQuestionLayout({
  children,
}: AdminCourseLessonLayoutProps) {
  const { id, lessonId } = useParams();

  const { courseLessons } = useCourseLessons({
    courseId: id as CourseId,
  });

  useConditionalForwarder({
    skipCondition: !courseLessons || courseLessons.length === 0,
    forwardCondition: !lessonId,
    forwardTo: `/admin/courses/${id}/lessons/${courseLessons?.[0].lessonId}`,
  });

  if (!id) return null;
  return children;
}
