"use client";

import React from "react";
import { Breadcrumbs, Text } from "@/lib/ui";
import { type LessonId, QuickEditLessonForm, useLesson } from "@/lib/Lessons";
import { LessonSectionId, LessonSectionsNav } from "@/lib/LessonSections";
import { useParams } from "next/navigation";
import { AdminLayout } from "@/lib/layout";

interface AdminLessonLayoutProps {
  children: React.ReactNode;
}

export default function AdminLessonLayout({
  children,
}: AdminLessonLayoutProps) {
  const { id, sectionId } = useParams();
  const { isLoading, lesson } = useLesson({
    id: id as LessonId,
  });

  if (isLoading || !lesson) return null;

  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
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
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper>
        <div className="mr-4">
          <Text className="text-3xl font-bold">{lesson.title}</Text>
          <Text className="text-muted-foreground">{lesson.description}</Text>
        </div>
        <QuickEditLessonForm lessonId={lesson._id} />
      </AdminLayout.PageTitleWrapper>
      <AdminLayout.NavAndContentFlexWrapper>
        <AdminLayout.NavWrapper>
          <LessonSectionsNav
            lessonId={id as LessonId}
            sectionId={sectionId as LessonSectionId}
          />
        </AdminLayout.NavWrapper>
        <AdminLayout.ContentWrapper>{children}</AdminLayout.ContentWrapper>
      </AdminLayout.NavAndContentFlexWrapper>
    </>
  );
}
