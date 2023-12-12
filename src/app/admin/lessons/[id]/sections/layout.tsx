"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LessonId } from "@/lib/Lessons";
import {
  LessonSectionId,
  LessonSectionsNav,
  useLessonSections,
} from "@/lib/LessonSections";
import { useConditionalForwarder } from "@/lib/hooks";

interface AdminLessonSectionLayoutProps {
  children: React.ReactNode;
}

export default function AdminLessonSectionLayout({
  children,
}: AdminLessonSectionLayoutProps) {
  const router = useRouter();
  const { id, sectionId } = useParams();
  const { lessonSections } = useLessonSections({
    lessonId: id as LessonId,
  });

  useConditionalForwarder({
    skipCondition: !lessonSections || lessonSections.length === 0,
    forwardCondition: !sectionId,
    forwardTo: `/admin/lessons/${id}/sections/${
      lessonSections?.[0]?._id ?? ""
    }`,
  });

  if (!id) return null;

  return children;
}
