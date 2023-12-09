import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useDeleteAssessment() {
  const deleteAssessment = useMutation(api.assessments.deleteById);
  return { deleteAssessment };
}
