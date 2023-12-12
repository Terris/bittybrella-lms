"use client";

import { AdminLayout } from "@/lib/layout";
import { QuickCreateLessonForm, LessonsTable } from "@/lib/Lessons";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function AdminLessonsPage() {
  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/lessons", label: "Lessons" },
          ]}
        />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper align="between">
        <Text className="text-3xl font-bold">Lessons</Text>
        <QuickCreateLessonForm />
      </AdminLayout.PageTitleWrapper>
      <AdminLayout.TableWrapper>
        <LessonsTable />
      </AdminLayout.TableWrapper>
    </>
  );
}
