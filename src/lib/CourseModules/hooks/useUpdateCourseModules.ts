import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateCourseModules() {
  const updateCourseModules = useMutation(
    api.courseModules.updateAllByCourseId
  );
  return { updateCourseModules };
}
