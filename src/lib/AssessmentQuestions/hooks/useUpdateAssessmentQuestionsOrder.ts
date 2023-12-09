import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAssessmentQuestions } from "./useAssessmentQuestions";
import { AssessmentId } from "@/lib/Assessments";

// We always want to optimistically update order changes
export function useUpdateAssessmentQuestionsOrder({
  assessmentId,
}: {
  assessmentId?: AssessmentId;
}) {
  const { assessmentQuestions } = useAssessmentQuestions({ assessmentId });

  const updateAssessmentQuestionsOrder = useMutation(
    api.assessmentQuestions.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    if (!assessmentId || !assessmentQuestions) return;

    const { idsInOrder } = args;
    const currentValue = localStore.getQuery(
      api.assessmentQuestions.findByAssessmentId,
      {
        assessmentId,
      }
    );
    if (currentValue === undefined) return;

    const updatedAssessmentQuestions = assessmentQuestions
      .map((question) => ({
        ...question,
        order: idsInOrder.indexOf(question._id) + 1,
      }))
      .sort((a, b) => a.order - b.order);

    localStore.setQuery(
      api.assessmentQuestions.findByAssessmentId,
      {
        assessmentId,
      },
      [...updatedAssessmentQuestions]
    );
  });
  return { updateAssessmentQuestionsOrder };
}
