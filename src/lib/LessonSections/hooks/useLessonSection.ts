import { useQuery } from "convex/react";
import { LessonSectionId } from "..";
import { api } from "../../../../convex/_generated/api";
import { skipOrBuildArgs } from "@/lib/utils";

export function useLessonSection({ id }: { id: LessonSectionId }) {
  const lessonSection = useQuery(
    api.lessonSections.findById,
    skipOrBuildArgs([!id], { id })
  );
  const isLoading = !lessonSection;
  const error = !isLoading && !lessonSection ? "Not found" : undefined;
  return { isLoading, error, lessonSection };
}
