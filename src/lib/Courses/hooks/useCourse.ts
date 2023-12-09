import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { CourseId } from "../types";

export function useCourse({ id }: { id: CourseId }) {
  const course = useQuery(api.courses.findById, { id });
  const isLoading = !course;
  const error = !isLoading && !course ? "Error loading assessment" : null;
  return { course, isLoading, error };
}
