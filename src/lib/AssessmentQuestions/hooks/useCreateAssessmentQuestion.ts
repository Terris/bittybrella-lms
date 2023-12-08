import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export function useCreateAssessmentQuestion({
  assessmentId,
}: {
  assessmentId: Id<"assessments">;
}) {
  const createAssessmentQuestion = useMutation(api.assessmentQuestions.create);

  const createBlankAssessmentQuestion = () =>
    createAssessmentQuestion({
      assessmentId,
      question: "Blank question",
      options: [],
    });

  return { createAssessmentQuestion, createBlankAssessmentQuestion };
}
