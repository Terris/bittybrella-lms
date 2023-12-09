import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateAssessment() {
  const updateAssessment = useMutation(api.assessments.update);
  return { updateAssessment };
}
