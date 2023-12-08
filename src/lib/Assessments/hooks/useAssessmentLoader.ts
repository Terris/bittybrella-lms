import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export function useAssessmentLoader({ id }: { id: Id<"assessments"> }) {
  // Assessment
  const assessment = useQuery(api.assessments.findById, { id });
  const isLoading = !assessment;
  const error = !isLoading && !assessment ? "Error loading assessment" : null;

  return { assessment, isLoading, error };
}
