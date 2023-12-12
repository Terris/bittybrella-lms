"use client";

import React from "react";
import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";
import { type LessonId, QuickEditLessonForm, useLesson } from "@/lib/Lessons";

interface AdminLessonLayoutProps {
  params: { id: string };
  children: React.ReactNode;
}

export default function AdminLessonLayout({
  params,
  children,
}: AdminLessonLayoutProps) {
  const { isLoading, lesson } = useLesson({
    id: params.id as LessonId,
  });

  if (isLoading || !lesson) return null;

  return (
    <PageContent>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/lessons", label: "Lessons" },
            {
              href: `/admin/lessons/${lesson._id}`,
              label: lesson.title ?? "Untitled Assessment",
            },
          ]}
        />
      </div>
      <div className="w-full flex flex-row items-center justify-start py-4 px-8 border-b">
        <div className="mr-4">
          <Text className="text-3xl font-bold">{lesson.title}</Text>
          <Text className="text-muted-foreground">{lesson.description}</Text>
        </div>
        <QuickEditLessonForm lessonId={lesson._id} />
      </div>
      {children}
    </PageContent>
  );
}
