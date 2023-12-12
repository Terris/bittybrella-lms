import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateCourseLessons() {
  const updateCourseLessons = useMutation(
    api.courseLessons.updateAllByCourseId
  );
  return { updateCourseLessons };
}
