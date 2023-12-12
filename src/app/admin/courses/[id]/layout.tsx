"use client";

import React from "react";
import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";
import { CourseId, QuickEditCourseForm, useCourse } from "@/lib/Courses";

interface AdminAssessmentLayoutProps {
  params: { id: string };
  children: React.ReactNode;
}

export default function AdminAssessmentLayout({
  params,
  children,
}: AdminAssessmentLayoutProps) {
  const { isLoading, course } = useCourse({
    id: params.id as CourseId,
  });

  if (isLoading || !course) return null;

  return (
    <PageContent>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/courses", label: "Courses" },
            {
              href: `/admin/courses/${params.id}`,
              label: course.title ?? "Untitled Course",
            },
          ]}
        />
      </div>
      <div className="w-full flex flex-row items-center justify-start py-4 px-8 border-b">
        <div className="mr-4">
          <Text className="text-3xl font-bold">{course.title}</Text>
          <Text className="text-muted-foreground">{course.description}</Text>
        </div>
        <QuickEditCourseForm courseId={params.id as CourseId} />
      </div>
      {children}
    </PageContent>
  );
}
