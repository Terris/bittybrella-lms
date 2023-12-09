import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useCreateAssessment() {
  const createAssessment = useMutation(api.assessments.create);
  return { createAssessment };
}
