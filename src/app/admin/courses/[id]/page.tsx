"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { FlexRow, Text } from "@/lib/ui";
import { useEffect, useState } from "react";
import { QuickEditCourseModulesForm } from "./QuickEditCourseModulesForm";
import { CourseModulesNav } from "./CourseModulesNav";
import { ModuleSectionsNav } from "../../modules/[id]/ModuleSectionsNav";
import { EditModuleSectionForm } from "../../modules/[id]/EditModuleSectionForm";
import { QuickEditCourseForm } from "../QuickEditCourseForm";

interface AdminCoursePageProps {
  params: { id: string };
}

export default function AdminCoursePage({ params }: AdminCoursePageProps) {
  const course = useQuery(api.courses.findById, {
    id: params.id as Id<"courses">,
  });

  const [selectedModuleId, setSelectedModuleId] =
    useState<Id<"modules"> | null>(null);

  const [selectedModuleSectionId, setSelectedModuleSectionId] =
    useState<Id<"moduleSections"> | null>(null);

  useEffect(() => {
    if (!course?.modules?.[0]?._id || !!selectedModuleId) return;
    setSelectedModuleId(course?.modules?.[0]._id ?? null);
  }, [course?.modules, selectedModuleId]);

  if (!course) return null;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/courses", label: "Courses" },
          {
            href: `/admin/courses/${params.id}`,
            label: course.title ?? "Untitled Course",
          },
        ]}
      />
      <PageContent>
        <FlexRow className="justify-between">
          <div className="space-y-0.5">
            <Text className="text-2xl font-semibold">{course.title}</Text>
            <Text className="text-muted-foreground">{course.description}</Text>
          </div>
          <QuickEditCourseForm courseId={params.id as Id<"courses">} />
        </FlexRow>
        <hr />
        <div className="flex flex-col lg:flex-row lg:h-full">
          <aside className="lg:w-1/4 lg:pr-4 lg:pt-2">
            <CourseModulesNav
              courseId={params.id as Id<"courses">}
              modules={course.modules}
              selectedModuleId={selectedModuleId}
              setSelectedModuleId={setSelectedModuleId}
              selectedModuleSectionId={selectedModuleSectionId}
              setSelectedModuleSectionId={setSelectedModuleSectionId}
            />
          </aside>
          <div className="flex-1 lg:w-3/4 lg:pl-4">
            {selectedModuleSectionId && (
              <EditModuleSectionForm id={selectedModuleSectionId} />
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
}
