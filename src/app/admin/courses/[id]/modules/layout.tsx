"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CourseModuleId,
  CourseModulesNav,
  useCourseModules,
} from "@/lib/CourseModules";
import { CourseId } from "@/lib/Courses";
import { ModuleSectionId } from "@/lib/ModuleSections";
import { ModuleId } from "@/lib/Modules";

interface AdminCourseModuleLayoutProps {
  children: React.ReactNode;
}

export default function AdminAssessmentQuestionLayout({
  children,
}: AdminCourseModuleLayoutProps) {
  const router = useRouter();
  const { id, moduleId, moduleSectionId } = useParams();
  console.log("params:", [id, moduleId, moduleSectionId]);
  const { courseModules } = useCourseModules({
    courseId: id as CourseId,
  });

  useEffect(() => {
    if (!courseModules || courseModules.length === 0) return;
    if (!moduleId) {
      router.replace(
        `/admin/courses/${id}/modules/${courseModules[0].moduleId}`
      );
    }
  });

  if (!id) return null;

  return (
    <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
      <aside className="px-4 lg:w-1/4 lg:max-w-4xl lg:pl-8">
        <div className="sticky top-4">
          <CourseModulesNav
            courseId={id as CourseId}
            moduleId={moduleId as ModuleId}
            moduleSectionId={moduleSectionId as ModuleSectionId}
          />
        </div>
      </aside>
      <div className="px-4  lg:pr-8">
        <div className="flex flex-col gap-4 max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
