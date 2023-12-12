import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useDeleteCourse() {
  const deleteCourse = useMutation(api.courses.deleteById);
  return { deleteCourse };
}
