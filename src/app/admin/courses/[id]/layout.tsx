"use client";

import React from "react";
import { AdminLayout } from "@/lib/Admin";
import { Breadcrumbs, Text } from "@/lib/ui";
import { CourseId, QuickEditCourseForm, useCourse } from "@/lib/Courses";
import { CourseLessonsNav } from "@/lib/CourseLessons";
import { useParams } from "next/navigation";
import { LessonId } from "@/lib/Lessons";
import { LessonSectionId } from "@/lib/LessonSections";

interface AdminAssessmentLayoutProps {
  children: React.ReactNode;
}

export default function AdminAssessmentLayout({
  children,
}: AdminAssessmentLayoutProps) {
  const { id, lessonId, lessonSectionId } = useParams();

  const { isLoading, course } = useCourse({
    id: id as CourseId,
  });

  if (isLoading || !course) return null;

  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/courses", label: "Courses" },
            {
              href: `/admin/courses/${id}`,
              label: course.title ?? "Untitled Course",
            },
          ]}
        />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper>
        <div className="mr-4">
          <Text className="text-3xl font-bold">{course.title}</Text>
          <Text className="text-muted-foreground">{course.description}</Text>
        </div>
        <QuickEditCourseForm courseId={id as CourseId} />
      </AdminLayout.PageTitleWrapper>
      <AdminLayout.NavAndContentFlexWrapper>
        <AdminLayout.NavWrapper>
          <CourseLessonsNav
            courseId={id as CourseId}
            lessonId={lessonId as LessonId}
            lessonSectionId={lessonSectionId as LessonSectionId}
          />
        </AdminLayout.NavWrapper>
        <AdminLayout.ContentWrapper>{children}</AdminLayout.ContentWrapper>
      </AdminLayout.NavAndContentFlexWrapper>
    </>
  );
}
