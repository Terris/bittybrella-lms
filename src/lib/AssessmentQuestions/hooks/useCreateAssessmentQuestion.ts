import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AssessmentId } from "@/lib/Assessments";

export function useCreateAssessmentQuestion({
  assessmentId,
}: {
  assessmentId: AssessmentId;
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
