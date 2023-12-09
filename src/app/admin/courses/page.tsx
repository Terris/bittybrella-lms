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
        <Text className="text-2xl font-semibold">Courses</Text>
        <hr />
        <CoursesTable />
      </PageContent>
    </>
  );
}
