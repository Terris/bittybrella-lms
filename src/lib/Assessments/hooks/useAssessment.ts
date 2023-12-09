import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { AssessmentId } from "../types";

export function useAssessment({ id }: { id: AssessmentId }) {
  const assessment = useQuery(api.assessments.findById, { id });
  const isLoading = !assessment;
  const error = !isLoading && !assessment ? "Error loading assessment" : null;
  return { assessment, isLoading, error };
}
