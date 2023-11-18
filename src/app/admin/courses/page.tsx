"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageContent, PageHeader } from "@/lib/layout";
import { CreateCourseForm } from "./CreateCourseForm";
import { columns } from "./CoursesTableConfig";
import { AdminTable } from "../AdminTable";

export default function AdminPage() {
  const coursesData = useQuery(api.courses.getAll);

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
        {coursesData && <AdminTable columns={columns} data={coursesData} />}
      </PageContent>
    </>
  );
}
