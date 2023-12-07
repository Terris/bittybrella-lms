"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import {
  Button,
  Text,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FlexRow,
} from "@/lib/ui";
import { useEffect, useState } from "react";
import {
  SortableList,
  SortableListItem,
} from "@/lib/providers/SortableListProvider";
import { QuickEditCourseModulesForm } from "../../../../lib/forms/admin/CourseModules/QuickEditCourseModulesForm";
import { QuickEditCourseForm } from "../../../../lib/forms/admin/Courses/QuickEditCourseForm";

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
    selectedModuleId !== null
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
        <FlexRow className="justify-between">
          <div className="space-y-0.5">
            <Text className="text-2xl font-semibold">{course.title}</Text>
            <Text className="text-muted-foreground">{course.description}</Text>
          </div>
          <QuickEditCourseForm courseId={params.id as Id<"courses">} />
        </FlexRow>
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
              <ModuleNav
                courseId={params.id as Id<"courses">}
                modules={course.modules}
                selectedModuleId={selectedModuleId}
                setSelectedModuleId={setSelectedModuleId}
              />
            </div>
          </aside>
          <aside className="lg:w-1/4 lg:pr-4">
            <div className="flex flex-col gap-4 lg:sticky lg:top-0">
              <div className="flex items-center justify-between">
                <Text className="font-bold">Module Sections</Text>
              </div>
              {moduleData && (
                <ModuleSectionNav
                  moduleId={params.id as Id<"modules">}
                  sections={moduleData.sections}
                  selectedModuleSectionId={selectedModuleSectionId}
                  setSelectedModuleSectionId={setSelectedModuleSectionId}
                />
              )}
            </div>
          </aside>
          <div className="flex-1 lg:w-1/2 lg:pl-8">
            {selectedModuleSectionId && <p>{selectedModuleSectionId}</p>}
          </div>
        </div>
      </PageContent>
    </>
  );
}

interface CourseModule extends Doc<"modules"> {
  sections: Doc<"moduleSections">[];
  order: number;
  courseModuleId: Id<"courseModules">;
}

function ModuleNav({
  courseId,
  modules,
  selectedModuleId,
  setSelectedModuleId,
}: {
  courseId: Id<"courses">;
  modules: CourseModule[];
  selectedModuleId: Id<"modules"> | null;
  setSelectedModuleId: (id: Id<"modules">) => void;
}) {
  const sortItems = modules.map((module) => module.courseModuleId);

  const updateCourseModulesOrder = useMutation(
    api.courseModules.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    const { idsInOrder } = args;

    const updatedModules = modules
      .map((module) => ({
        ...module,
        order: idsInOrder.indexOf(module.courseModuleId) + 1,
      }))
      .sort((a, b) => a.order - b.order);
    const currentValue = localStore.getQuery(api.courses.findById, {
      id: courseId,
    });
    if (currentValue !== undefined) {
      localStore.setQuery(
        api.courses.findById,
        {
          id: courseId,
        },
        { ...currentValue, modules: updatedModules }
      );
    }
  });

  function handleOnUpdate(updatedItems: string[]) {
    updateCourseModulesOrder({
      idsInOrder: updatedItems as Id<"courseModules">[],
    });
  }

  return (
    <>
      <div className="hidden lg:block">
        <SortableList items={sortItems} onUpdate={handleOnUpdate}>
          <div className="flex flex-col gap-2">
            {modules.map((module) => (
              <SortableListItem
                key={module.courseModuleId}
                id={module.courseModuleId}
              >
                <div className="flex flex-col flex-1 truncate">
                  <Button
                    key={module._id}
                    variant={
                      selectedModuleId === module?._id ? "secondary" : "ghost"
                    }
                    onClick={() => setSelectedModuleId(module?._id)}
                    className="flex-1 truncate"
                  >
                    <div className="w-full text-left truncate">
                      {module.order}. {module.title ?? "Untitled section"}
                    </div>
                  </Button>
                </div>
              </SortableListItem>
            ))}
          </div>
        </SortableList>
      </div>
      <div className="block lg:hidden pb-6">
        <Select
          onValueChange={(val) => setSelectedModuleId(val as Id<"modules">)}
          value={selectedModuleId as string}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem value={module._id} key={module._id}>
                {module.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function ModuleSectionNav({
  moduleId,
  sections,
  selectedModuleSectionId,
  setSelectedModuleSectionId,
}: {
  moduleId: Id<"modules">;
  sections: Doc<"moduleSections">[];
  selectedModuleSectionId: Id<"moduleSections"> | null;
  setSelectedModuleSectionId: (id: Id<"moduleSections">) => void;
}) {
  const sortItems = sections.map((section) => section._id);

  const updateSectionsOrder = useMutation(
    api.moduleSections.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    const { idsInOrder } = args;
    const updatedModuleSections = sections
      .map((section, index) => ({
        ...section,
        order: idsInOrder.indexOf(section._id) + 1,
      }))
      .sort((a, b) => a.order - b.order);
    const currentValue = localStore.getQuery(api.modules.findById, {
      id: moduleId,
    });
    if (currentValue !== undefined) {
      localStore.setQuery(
        api.modules.findById,
        {
          id: moduleId,
        },
        { ...currentValue, sections: updatedModuleSections }
      );
    }
  });

  function handleOnUpdate(updatedItems: string[]) {
    updateSectionsOrder({
      idsInOrder: updatedItems as Id<"moduleSections">[],
    });
  }

  return (
    <>
      <SortableList items={sortItems} onUpdate={handleOnUpdate}>
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <SortableListItem key={section._id} id={section._id}>
              <Button
                key={section?._id}
                variant={
                  selectedModuleSectionId === section?._id
                    ? "secondary"
                    : "ghost"
                }
                onClick={() => setSelectedModuleSectionId(section?._id)}
                className="flex-1 truncate"
              >
                <div className="w-full text-left truncate">
                  {section.order}. {section?.title ?? "Untitled section"}
                </div>
              </Button>
            </SortableListItem>
          ))}
        </div>
      </SortableList>
      <div className="block lg:hidden pb-6">
        <Select
          onValueChange={(val) =>
            setSelectedModuleSectionId(val as Id<"moduleSections">)
          }
          value={selectedModuleSectionId as string}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem value={section._id} key={section._id}>
                {section.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

function Module({ id }: { id: Id<"modules"> }) {
  const courseModule = useQuery(api.modules.findById, {
    id,
  });

  if (!courseModule) return null;

  return (
    <>
      <Text className="pt-1 pb-16 text-4xl font-bold">
        {courseModule.title}
      </Text>
      {courseModule.sections?.map((section) => (
        <div key={section._id}>
          <Text className="text-2xl pb-8">{section.title}</Text>
          {courseModule.sections?.map((section) => (
            <div key={section._id}>
              <Text className="text-xl pb-4">{section.title}</Text>
            </div>
          ))}
          <hr className="my-8" />
        </div>
      ))}
    </>
  );
}
