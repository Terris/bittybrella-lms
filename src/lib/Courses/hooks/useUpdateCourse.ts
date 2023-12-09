import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateCourse() {
  const updateCourse = useMutation(api.courses.update);
  return { updateCourse };
}
