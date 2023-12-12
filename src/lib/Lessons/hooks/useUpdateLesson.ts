import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateLesson() {
  const updateLesson = useMutation(api.lessons.update);
  return { updateLesson };
}
