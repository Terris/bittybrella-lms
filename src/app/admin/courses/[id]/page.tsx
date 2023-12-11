"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";
import { CourseModulesNav } from "@/lib/CourseModules/views/CourseModulesNav";
import { EditModuleSectionForm } from "@/lib/ModuleSections/forms/EditModuleSectionForm";
import { QuickEditCourseForm } from "@/lib/Courses/forms/QuickEditCourseForm";
import { QuickEditModuleForm } from "@/lib/Modules";

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

  // reset selected module section when selected module changes
  useEffect(() => {
    setSelectedModuleSectionId(null);
  }, [selectedModuleId]);

  // Select the first module section of the selected module when no module section is selected
  useEffect(() => {
    if (!course || !selectedModuleId || !!selectedModuleSectionId) return;
    setSelectedModuleSectionId(selectedModule?.sections?.[0]?._id ?? null);
  }, [course, selectedModule, selectedModuleId, selectedModuleSectionId]);

  if (!course) return null;

  return (
    <>
      <PageContent>
        <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
          <Breadcrumbs
            breadcrumbs={[
              { href: "/admin", label: "Admin" },
              { href: "/admin/courses", label: "Courses" },
              {
                href: `/admin/courses/${params.id}`,
                label: course.title ?? "Untitled Course",
              },
            ]}
          />
        </div>
        <div className="w-full flex flex-row items-center justify-start py-4 px-8 border-b">
          <div className="mr-4">
            <Text className="text-3xl font-semibold">{course.title}</Text>
            <Text className="text-muted-foreground">{course.description}</Text>
          </div>
          <QuickEditCourseForm courseId={params.id as Id<"courses">} />
        </div>
        <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
          <aside className="px-4 lg:w-1/5 lg:pl-8">
            <div className="sticky top-4">
              <CourseModulesNav
                courseId={params.id as Id<"courses">}
                modules={course.modules}
                selectedModuleId={selectedModuleId}
                setSelectedModuleId={setSelectedModuleId}
                selectedModuleSectionId={selectedModuleSectionId}
                setSelectedModuleSectionId={setSelectedModuleSectionId}
              />
            </div>
          </aside>
          <div className="px-4 lg:w-4/5 lg:pr-8">
            <div className="flex flex-col gap-4 max-w-4xl">
              {selectedModule && (
                <div className="flex flex-row items-center justify-between">
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
                </div>
              )}
              <hr className="" />
              {selectedModuleSectionId && (
                <EditModuleSectionForm id={selectedModuleSectionId} />
              )}
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}
