import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CourseId } from "@/lib/Courses";
import { skipOrBuildArgs } from "@/lib/utils";

export function useCourseModules({ courseId }: { courseId?: CourseId }) {
  const courseModules = useQuery(
    api.courseModules.findByCourseIdWithModules,
    skipOrBuildArgs([!courseId], {
      courseId,
    })
  );
  const isLoading = !courseModules;
  const error = !isLoading && !courseModules ? "Error loading modules" : null;
  return { courseModules, isLoading, error };
}
