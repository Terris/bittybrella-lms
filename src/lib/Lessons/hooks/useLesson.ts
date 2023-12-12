import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { skipOrBuildArgs } from "@/lib/utils";

export function useLesson({ id }: { id: Id<"lessons"> }) {
  const lesson = useQuery(api.lessons.findById, skipOrBuildArgs([!id], { id }));
  const isLoading = !lesson;
  const error = !isLoading && !lesson ? "Error loading lesson" : null;
  return { lesson, isLoading, error };
}
