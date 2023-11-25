"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { Button, ContentEditor, ContentReader, Text } from "@/lib/ui";
import { useEffect, useState } from "react";

interface AdminCoursePageProps {
  params: { id: string };
}

export default function AdminCoursePage({ params }: AdminCoursePageProps) {
  const course = useQuery(api.courses.getWithModules, {
    id: params.id as Id<"courses">,
  });

  const [currentModuleId, setCurrentModuleId] = useState<Id<"modules"> | null>(
    null
  );

  useEffect(() => {
    if (!course?.modules?.[0]?._id || !!currentModuleId) return;
    setCurrentModuleId(course?.modules?.[0]._id ?? null);
  }, [course?.modules, currentModuleId]);

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
          <aside className="sticky top-0 lg:w-1/5 lg:pr-4">
            <div className="sticky top-0">
              <Text className="font-bold pt-2 pb-4">Modules</Text>
              {course.modules?.map((module) => (
                <Button
                  key={module?._id}
                  variant={
                    currentModuleId === module?._id ? "secondary" : "ghost"
                  }
                  onClick={() => setCurrentModuleId(module._id)}
                  className="w-full mb-4 text-left"
                >
                  <div className="w-full text-left truncate">
                    {module?.title ?? "Untitled module"}
                  </div>
                </Button>
              ))}
            </div>
          </aside>
          <div className="flex-1 lg:w-4/5 pl-4">
            {currentModuleId && <Module id={currentModuleId} />}
          </div>
        </div>
      </PageContent>
    </>
  );
}

function Module({ id }: { id: Id<"modules"> }) {
  const courseModule = useQuery(api.modules.getWithSections, {
    id,
  });

  if (!courseModule) return null;

  return (
    <div className="">
      <Text className="pt-12 pb-16 text-4xl">{courseModule.title}</Text>
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
