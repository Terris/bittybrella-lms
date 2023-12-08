"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { FlexRow, Text } from "@/lib/ui";
import { useEffect, useState } from "react";
import { CourseModulesNav } from "@/lib/Courses/CourseModulesNav";
import { EditModuleSectionForm } from "@/lib/Modules/EditModuleSectionForm";
import { QuickEditCourseForm } from "@/lib/Courses/QuickEditCourseForm";
import { QuickEditModuleForm } from "@/lib/Modules/QuickEditModuleForm";

interface AdminCoursePageProps {
  params: { id: string };
}

export default function AdminCoursePage({ params }: AdminCoursePageProps) {
  const course = useQuery(api.courses.findById, {
    id: params.id as Id<"courses">,
  });

  const [selectedModuleId, setSelectedModuleId] =
    useState<Id<"modules"> | null>(null);

  const selectedModule = course?.modules.find(
    (module) => module._id === selectedModuleId
  );

  const [selectedModuleSectionId, setSelectedModuleSectionId] =
    useState<Id<"moduleSections"> | null>(null);

  // Select the first module when no course is selected
  useEffect(() => {
    if (!course?.modules?.[0]?._id || !!selectedModuleId) return;
    setSelectedModuleId(course?.modules?.[0]._id ?? null);
  }, [course?.modules, selectedModuleId]);

  // Select the first module section of the selected module when no module section is selected
  useEffect(() => {
    if (!course || !selectedModuleId) return;

    setSelectedModuleSectionId(selectedModule?.sections?.[0]?._id ?? null);
  }, [course, selectedModule, selectedModuleId]);

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
          <div className="flex-1 flex flex-col gap-4 lg:w-3/4 lg:pl-4">
            {selectedModule && (
              <FlexRow className="justify-between">
                <div className="space-y-0.5">
                  <Text className="text-2xl font-semibold">
                    {selectedModule.title}
                  </Text>
                  <Text className="text-muted-foreground">
                    {selectedModule.description}
                  </Text>
                </div>
                <QuickEditModuleForm
                  moduleId={selectedModuleId as Id<"modules">}
                />
              </FlexRow>
            )}
            <hr className="" />
            {selectedModuleSectionId && (
              <EditModuleSectionForm id={selectedModuleSectionId} />
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
}
