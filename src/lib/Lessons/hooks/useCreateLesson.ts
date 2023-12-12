import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useCreateLesson() {
  const createLesson = useMutation(api.lessons.create);
  return { createLesson };
}
