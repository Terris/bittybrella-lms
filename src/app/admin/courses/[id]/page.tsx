"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
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

interface AdminCoursePageProps {
  params: { id: string };
}

export default function AdminCoursePage({ params }: AdminCoursePageProps) {
  const course = useQuery(api.courses.get, {
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
          <aside className="lg:w-1/4 lg:pr-4">
            <div className="lg:sticky lg:top-0">
              <Text className="font-bold pt-2 pb-4">Modules</Text>
              <div className="hidden lg:block">
                {course.modules?.map((module) => (
                  <Button
                    key={module?._id}
                    variant={
                      selectedModuleId === module?._id ? "secondary" : "ghost"
                    }
                    onClick={() => setSelectedModuleId(module._id)}
                    className="w-full mb-4 text-left"
                  >
                    <div className="w-full text-left truncate">
                      {module?.title ?? "Untitled module"}
                    </div>
                    <GripVertical className="w-4 h-4 ml-2" />
                  </Button>
                ))}
              </div>
              <div className="block lg:hidden pb-6">
                <Select
                  onValueChange={(val) =>
                    setSelectedModuleId(val as Id<"modules">)
                  }
                  value={selectedModuleId as string}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {course.modules?.map((module) => (
                      <SelectItem value={module._id} key={module._id}>
                        {module.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>
          <div className="flex-1 lg:w-3/4 lg:pl-4">
            {selectedModuleId && <Module id={selectedModuleId} />}
          </div>
        </div>
      </PageContent>
    </>
  );
}

function Module({ id }: { id: Id<"modules"> }) {
  const courseModule = useQuery(api.modules.get, {
    id,
  });

  if (!courseModule) return null;

  return (
    <div className="">
      <Text className="pt-1 pb-11 text-3xl">{courseModule.title}</Text>
      {courseModule.sections?.map((section) => (
        <>
          <Text
            key={section._id}
            className=" font-semibold uppercase tracking-[0.2rem] pb-8"
          >
            {section.title}
          </Text>
          <ContentReader content={section.content} />
          <hr className="my-8" />
        </>
      ))}
    </div>
  );
}
