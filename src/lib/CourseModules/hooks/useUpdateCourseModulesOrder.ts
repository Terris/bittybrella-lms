import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCourseModules } from "./useCourseModules";
import { CourseId } from "@/lib/Courses";

// We always want to optimistically update order changes
export function useUpdateCourseModulesOrder({
  courseId,
}: {
  courseId?: CourseId;
}) {
  const { courseModules } = useCourseModules({ courseId });

  const updateCourseModulesOrder = useMutation(
    api.courseModules.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    if (!courseId || !courseModules) return;
    const { idsInOrder } = args;

    const currentValue = localStore.getQuery(api.courseModules.findByCourseId, {
      courseId: courseId,
    });

    if (currentValue !== undefined) return;

    const updatedCourseModules = courseModules
      .map((courseModule) => ({
        ...courseModule,
        order: idsInOrder.indexOf(courseModule._id) + 1,
      }))
      .sort((a, b) => a.order - b.order);

    localStore.setQuery(
      api.courseModules.findByCourseId,
      {
        courseId,
      },
      [...updatedCourseModules]
    );
  });
  return { updateCourseModulesOrder };
}
