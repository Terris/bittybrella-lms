"use client";

import { AdminLayout } from "@/lib/Admin";
import { QuickCreateCourseForm } from "@/lib/Courses/forms/QuickCreateCourseForm";
import { CoursesTable } from "@/lib/Courses/views/CoursesTable";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function AdminCoursesPage() {
  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/courses", label: "Courses" },
          ]}
        />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper align="between">
        <Text className="text-3xl font-bold">Courses</Text>
        <QuickCreateCourseForm />
      </AdminLayout.PageTitleWrapper>
      <AdminLayout.TableWrapper>
        <CoursesTable />
      </AdminLayout.TableWrapper>
    </>
  );
}
