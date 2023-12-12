"use client";

import { useParams } from "next/navigation";
import { AssessmentId } from "@/lib/Assessments";
import { useAssessmentQuestions } from "@/lib/AssessmentQuestions";
import { useConditionalForwarder } from "@/lib/hooks";

interface AdminAssessmentQuestionLayoutProps {
  children: React.ReactNode;
}

export default function AdminAssessmentQuestionLayout({
  children,
}: AdminAssessmentQuestionLayoutProps) {
  const { id, questionId } = useParams();
  const { assessmentQuestions } = useAssessmentQuestions({
    assessmentId: id as AssessmentId,
  });

  useConditionalForwarder({
    skipCondition: !assessmentQuestions || assessmentQuestions.length === 0,
    forwardCondition: !questionId,
    forwardTo: `/admin/assessments/${id}/questions/${assessmentQuestions?.[0]._id}`,
  });

  if (!id) return null;
  return children;
}
