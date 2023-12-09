import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { skipWithConditions } from "@/lib/utils";

export function useAssessmentQuestions({
  assessmentId,
}: {
  assessmentId?: Id<"assessments">;
}) {
  const assessmentQuestions = useQuery(
    api.assessmentQuestions.findByAssessmentId,
    skipWithConditions([!assessmentId], { assessmentId })
  );
  const isLoading = !assessmentQuestions;
  const error =
    !isLoading && !assessmentQuestions
      ? "Error getting assessment questions."
      : null;

  return { isLoading, error, assessmentQuestions };
}
