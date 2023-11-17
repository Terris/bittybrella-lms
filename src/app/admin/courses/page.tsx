"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageContent, PageHeader } from "@/lib/layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/ui";
import { CreateCourseForm } from "./CreateCourseForm";

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
        <Table>
          {!coursesData && <TableCaption>No courses yet.</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Is Published</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coursesData?.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="whitespace-nowrap">
                  {course.title}
                </TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.isPublished.toString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageContent>
    </>
  );
}
