import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useCourseLessons } from "./useCourseLessons";
import { CourseId } from "@/lib/Courses";

// We always want to optimistically update order changes
export function useUpdateCourseLessonsOrder({
  courseId,
}: {
  courseId?: CourseId;
}) {
  const { courseLessons } = useCourseLessons({ courseId });

  const updateCourseLessonsOrder = useMutation(
    api.courseLessons.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    if (!courseId || !courseLessons) return;
    const { idsInOrder } = args;

    const currentValue = localStore.getQuery(api.courseLessons.findByCourseId, {
      courseId: courseId,
    });

    if (currentValue !== undefined) return;

    const updatedCourseLessons = courseLessons
      .map((courseLesson) => ({
        ...courseLesson,
        order: idsInOrder.indexOf(courseLesson._id) + 1,
      }))
      .sort((a, b) => a.order - b.order);

    localStore.setQuery(
      api.courseLessons.findByCourseId,
      {
        courseId,
      },
      [...updatedCourseLessons]
    );
  });
  return { updateCourseLessonsOrder };
}
