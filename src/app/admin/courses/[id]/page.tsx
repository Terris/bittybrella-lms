"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import {
  Button,
  ContentReader,
  Text,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui";
import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
import {
  SortableList,
  SortableListItem,
} from "@/lib/providers/SortableListProvider";
import { QuickEditCourseModulesForm } from "./QuickEditCourseModulesForm";

interface AdminCoursePageProps {
  params: { id: string };
}

export default function AdminCoursePage({ params }: AdminCoursePageProps) {
  const course = useQuery(api.courses.findById, {
    id: params.id as Id<"courses">,
  });

  const [selectedModuleId, setSelectedModuleId] =
    useState<Id<"modules"> | null>(null);

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
              <Text className="font-bold pt-2">Course Modules</Text>
              <ModuleNav
                courseId={params.id as Id<"courses">}
                modules={course.modules}
                selectedModuleId={selectedModuleId}
                setSelectedModuleId={setSelectedModuleId}
              />
              <QuickEditCourseModulesForm
                courseId={params.id as Id<"courses">}
              />
            </div>
          </aside>
          <div className="flex-1 lg:w-3/4 lg:pl-8">
            {selectedModuleId && (
              <Module courseTitle={course.title ?? ""} id={selectedModuleId} />
            )}
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

function Module({
  courseTitle,
  id,
}: {
  courseTitle: string;
  id: Id<"modules">;
}) {
  const courseModule = useQuery(api.modules.findById, {
    id,
  });

  if (!courseModule) return null;

  return (
    <>
      <Text className="text-center uppercase text-xs tracking-[0.2rem] pt-8 pb-4">
        {courseTitle}
      </Text>
      <Text className="pt-1 pb-16 text-4xl text-center font-bold">
        {courseModule.title}
      </Text>
      {courseModule.sections?.map((section) => (
        <div key={section._id}>
          <Text className="text-2xl pb-8">{section.title}</Text>
          <ContentReader content={section.content} />
          <hr className="my-8" />
        </div>
      ))}
    </>
  );
}
