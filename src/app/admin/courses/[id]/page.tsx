"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { ContentReader, Text } from "@/lib/ui";
import { useEffect, useState } from "react";
import { QuickEditCourseModulesForm } from "./QuickEditCourseModulesForm";
import { CourseModulesNav } from "./CourseModulesNav";
import { ModuleSectionsNav } from "../../modules/[id]/ModuleSectionsNav";
import { CreateModuleSectionButton } from "../../modules/[id]/CreateModuleSectionButton";
import { EditModuleSectionForm } from "../../modules/[id]/EditModuleSectionForm";

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

  const moduleData = useQuery(
    api.modules.findById,
    selectedModuleId
      ? {
          id: selectedModuleId,
        }
      : "skip"
  );

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
        <div className="space-y-0.5">
          <Text className="text-2xl font-semibold">{course.title}</Text>
          <Text className="text-muted-foreground">{course.description}</Text>
        </div>
        <hr />
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-1/4 lg:pr-8">
            <div className="flex flex-col gap-4 lg:sticky lg:top-0">
              <div className="flex justify-between items-center">
                <Text className="font-bold">Course Modules</Text>
                <QuickEditCourseModulesForm
                  courseId={params.id as Id<"courses">}
                />
              </div>
              <CourseModulesNav
                courseId={params.id as Id<"courses">}
                modules={course.modules}
                selectedModuleId={selectedModuleId}
                setSelectedModuleId={setSelectedModuleId}
              />
            </div>
          </aside>
          {moduleData && (
            <aside className="lg:w-1/4 lg:pr-4">
              <div className="flex flex-col gap-4 lg:sticky lg:top-0">
                <div className="flex items-center justify-between">
                  <Text className="font-bold">Module Sections</Text>
                  <CreateModuleSectionButton
                    moduleId={selectedModuleId as Id<"modules">}
                  />
                </div>
                <ModuleSectionsNav
                  moduleId={selectedModuleId as Id<"modules">}
                  sections={moduleData.sections}
                  selectedModuleSectionId={selectedModuleSectionId}
                  setSelectedModuleSectionId={setSelectedModuleSectionId}
                />
              </div>
            </aside>
          )}

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
