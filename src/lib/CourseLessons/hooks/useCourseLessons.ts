import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CourseId } from "@/lib/Courses";
import { skipOrBuildArgs } from "@/lib/utils";

export function useCourseLessons({ courseId }: { courseId?: CourseId }) {
  const courseLessons = useQuery(
    api.courseLessons.findByCourseIdWithLessons,
    skipOrBuildArgs([!courseId], {
      courseId,
    })
  );
  const isLoading = !courseLessons;
  const error = !isLoading && !courseLessons ? "Error loading lessons" : null;
  return { courseLessons, isLoading, error };
}
