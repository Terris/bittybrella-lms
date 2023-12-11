import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { AssessmentId } from "../types";
import { skipOrBuildArgs } from "@/lib/utils";

export function useAssessment({ id }: { id: AssessmentId }) {
  const assessment = useQuery(
    api.assessments.findById,
    skipOrBuildArgs([!id], { id })
  );
  const isLoading = !assessment;
  const error = !isLoading && !assessment ? "Error loading assessment" : null;
  return { assessment, isLoading, error };
}
