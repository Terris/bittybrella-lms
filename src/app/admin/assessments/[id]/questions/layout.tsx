"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AssessmentId } from "@/lib/Assessments";
import {
  AssessmentQuestionId,
  AssessmentQuestionsNav,
  useAssessmentQuestions,
} from "@/lib/AssessmentQuestions";

interface AdminAssessmentQuestionLayoutProps {
  children: React.ReactNode;
}

export default function AdminAssessmentQuestionLayout({
  children,
}: AdminAssessmentQuestionLayoutProps) {
  const router = useRouter();
  const { id, questionId } = useParams();
  const { assessmentQuestions } = useAssessmentQuestions({
    assessmentId: id as AssessmentId,
  });

  useEffect(() => {
    if (!assessmentQuestions) return;
    if (!questionId) {
      router.replace(
        `/admin/assessments/${id}/questions/${assessmentQuestions[0]._id}`
      );
    }
  });

  if (!id) return null;

  return (
    <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
      <aside className="px-4 lg:w-1/5 lg:pl-8">
        <div className="sticky top-2">
          <AssessmentQuestionsNav
            assessmentId={id as AssessmentId}
            questionId={questionId as AssessmentQuestionId}
          />
        </div>
      </aside>
      <div className="px-4 lg:w-4/5 lg:pr-8">
        <div className="flex flex-col gap-4 max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
