import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useAllAssessments() {
  const assessments = useQuery(api.assessments.all);
  const isLoading = !assessments;
  const error = !isLoading && !assessments ? "Error loading assessments" : null;
  return { isLoading, error, assessments };
}
