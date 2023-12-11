"use client";

import { PageContent } from "@/lib/layout";
import { QuickCreateCourseForm } from "@/lib/Courses/forms/QuickCreateCourseForm";
import { CoursesTable } from "@/lib/Courses/views/CoursesTable";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function AdminCoursesPage() {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/courses", label: "Courses" },
          ]}
        />
      </div>
      <PageContent>
        <div className="py-4 px-8 border-b flex flex-row items-center justify-between">
          <Text className="text-3xl font-semibold">Courses</Text>
          <QuickCreateCourseForm />
        </div>
        <div className="px-4 w-full max-w-screen-2xl mx-auto">
          <CoursesTable />
        </div>
      </PageContent>
    </>
  );
}
