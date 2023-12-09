import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useCreateCourse() {
  const createCourse = useMutation(api.courses.create);
  return { createCourse };
}
