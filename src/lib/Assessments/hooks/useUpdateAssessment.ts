import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateAssessment() {
  const updateAssessment = useMutation(
    api.assessments.update
  ).withOptimisticUpdate((localStore, args) => {
    const { id, title, description } = args;
    const currentValue = localStore.getQuery(api.assessments.findById, {
      id,
    });
    if (!currentValue) return;
    const updatedValue = {
      ...currentValue,
      title: title ?? currentValue?.title,
      description: description ?? currentValue?.description,
    };
    localStore.setQuery(api.assessments.findById, { id }, updatedValue);
  });
  return { updateAssessment };
}
