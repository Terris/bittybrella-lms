import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { buildArgsWithSkipConditions } from "@/lib/utils";
import { AssessmentId } from "@/lib/Assessments";

export function useAssessmentQuestions({
  assessmentId,
}: {
  assessmentId?: AssessmentId;
}) {
  const assessmentQuestions = useQuery(
    api.assessmentQuestions.findByAssessmentId,
    buildArgsWithSkipConditions([!assessmentId], { assessmentId })
  );
  const isLoading = !assessmentQuestions;
  const error =
    !isLoading && !assessmentQuestions
      ? "Error getting assessment questions."
      : null;

  return { isLoading, error, assessmentQuestions };
}
