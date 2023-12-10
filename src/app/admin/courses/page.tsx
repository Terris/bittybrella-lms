"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { QuickCreateCourseForm } from "@/lib/Courses/forms/QuickCreateCourseForm";
import { CoursesTable } from "@/lib/Courses/views/CoursesTable";
import { Text } from "@/lib/ui";

export default function AdminCoursesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/courses", label: "Courses" },
        ]}
        renderActions={<QuickCreateCourseForm />}
      />
      <PageContent>
        <div className="py-4 px-8 border-b">
          <Text className="text-3xl font-semibold">Courses</Text>
        </div>
        <div className="px-4 w-full max-w-screen-2xl mx-auto">
          <CoursesTable />
        </div>
      </PageContent>
    </>
  );
}
