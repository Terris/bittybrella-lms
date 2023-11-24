"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { Text } from "@/lib/ui";

interface AdminCoursePageProps {
  params: { id: string };
}

export default function AdminCoursePage({ params }: AdminCoursePageProps) {
  const course = useQuery(api.courses.getWithModules, {
    id: params.id as Id<"courses">,
  });

  if (!course) return null;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/courses", label: "Courses" },
          { href: `/admin/courses/${params.id}`, label: course.title },
        ]}
      />
      <PageContent>
        <div className="space-y-0.5">
          <Text className="text-2xl font-bold tracking-tight">
            {course.title}
          </Text>
          <Text className="text-muted-foreground">{course.description}</Text>
        </div>
        <hr />
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-1/5">Modules</aside>
          <div className="flex-1">Module Content</div>
        </div>
      </PageContent>
    </>
  );
}
