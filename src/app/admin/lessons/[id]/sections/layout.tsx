"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LessonId } from "@/lib/Lessons";
import {
  LessonSectionId,
  LessonSectionsNav,
  useLessonSections,
} from "@/lib/LessonSections";

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

  useEffect(() => {
    if (!lessonSections || lessonSections.length === 0) return;
    if (!sectionId) {
      router.replace(`/admin/lessons/${id}/sections/${lessonSections[0]._id}`);
    }
  });

  if (!id) return null;

  return (
    <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
      <aside className="px-4 lg:w-1/5 lg:pl-8">
        <div className="sticky top-4">
          <LessonSectionsNav
            lessonId={id as LessonId}
            sectionId={sectionId as LessonSectionId}
          />
        </div>
      </aside>
      <div className="px-4 lg:w-4/5 lg:pr-8">
        <div className="flex flex-col gap-4 max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
