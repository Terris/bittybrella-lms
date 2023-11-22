"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { CreateCourseForm } from "./CreateCourseForm";
import { CoursesForm } from "./CoursesTable";
import { ContentEditor } from "../ContentEditor";

export default function AdminPage() {
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
        <CoursesForm />
        <ContentEditor />
      </PageContent>
    </>
  );
}
