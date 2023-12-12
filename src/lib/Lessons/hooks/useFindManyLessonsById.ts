import { useQuery } from "convex/react";
import { type LessonId } from "../types";
import { api } from "../../../../convex/_generated/api";
import { skipOrBuildArgs } from "@/lib/utils";

export function useFindManyLessonsById({ ids }: { ids: LessonId[] }) {
  const lessons = useQuery(
    api.lessons.findManyById,
    skipOrBuildArgs([!ids], { ids })
  );
  const isLoading = !lessons;
  const error = !isLoading && !lessons ? "Error loading lessons" : undefined;
  return { isLoading, error, lessons };
}
