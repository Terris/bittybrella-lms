import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CourseId } from "@/lib/Courses";

export function useCourseModules({ courseId }: { courseId: CourseId }) {
  const courseModules = useQuery(api.courseModules.findByCourseId, {
    courseId,
  });
  const isLoading = !courseModules;
  const error = !isLoading && !courseModules ? "Error loading modules" : null;
  return { courseModules, isLoading, error };
}
