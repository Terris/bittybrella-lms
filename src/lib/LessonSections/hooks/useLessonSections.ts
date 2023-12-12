import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { LessonId } from "@/lib/Lessons";
import { skipOrBuildArgs } from "@/lib/utils";

export function useLessonSections({ lessonId }: { lessonId?: LessonId }) {
  const lessonSections = useQuery(
    api.lessonSections.findByLessonId,
    skipOrBuildArgs([!lessonId], { lessonId })
  );
  const isLoading = !lessonSections;
  const error =
    !isLoading && !lessonSections
      ? "Error getting assessment questions."
      : null;
  return { isLoading, error, lessonSections };
}
