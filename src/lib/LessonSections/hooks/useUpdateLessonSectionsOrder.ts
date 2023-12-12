import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { LessonId } from "@/lib/Lessons";
import { useLessonSections } from "./useLessonSections";

// We always want to optimistically update order changes
export function useUpdateLessonSectionsOrder({
  lessonId,
}: {
  lessonId?: LessonId;
}) {
  const { lessonSections } = useLessonSections({ lessonId });

  const updateLessonSectionsOrder = useMutation(
    api.lessonSections.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    if (!lessonId || !lessonSections) return;
    const { idsInOrder } = args;
    const updatedLessonSections = lessonSections
      .map((section) => ({
        ...section,
        order: idsInOrder.indexOf(section._id) + 1,
      }))
      .sort((a, b) => a.order - b.order);
    const currentValue = localStore.getQuery(
      api.lessonSections.findByLessonId,
      {
        lessonId,
      }
    );
    if (currentValue !== undefined) {
      localStore.setQuery(
        api.lessonSections.findByLessonId,
        {
          lessonId,
        },
        [...updatedLessonSections]
      );
    }
  });
  return { updateLessonSectionsOrder };
}
