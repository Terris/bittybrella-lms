"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/ui";

export default function AdminPage() {
  const coursesData = useQuery(api.courses.getAll);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/courses", label: "Courses" },
        ]}
      />
      <PageContent>
        <Table>
          <TableCaption>A list of all courses.</TableCaption>
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
