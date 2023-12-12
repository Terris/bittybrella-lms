import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useFindAllLessons() {
  const lessons = useQuery(api.lessons.all);
  const isLoading = !lessons;
  const error = !isLoading && !lessons ? "Error loading lessons" : null;
  return { lessons, isLoading, error };
}
