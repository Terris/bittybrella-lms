import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useDeleteLessonSection() {
  const deleteLessonSection = useMutation(api.lessonSections.deleteById);
  return { deleteLessonSection };
}
