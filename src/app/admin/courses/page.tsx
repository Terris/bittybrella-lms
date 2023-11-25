"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { CreateCourseForm } from "./CreateCourseForm";
import { CoursesForm } from "./CoursesTable";
import { Text } from "@/lib/ui";

export default function AdminCoursesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/courses", label: "Courses" },
        ]}
        renderActions={<CreateCourseForm />}
      />
      <PageContent>
        <Text className="text-2xl font-semibold">Courses</Text>
        <hr />
        <CoursesForm />
      </PageContent>
    </>
  );
}
