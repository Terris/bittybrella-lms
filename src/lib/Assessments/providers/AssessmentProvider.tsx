"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useAssessment } from "../hooks/useAssessment";
import { useCreateAssessmentQuestion } from "../../AssessmentQuestions/hooks/useCreateAssessmentQuestion";
import type { AssessmentDoc, AssessmentId } from "../types";
import { AssessmentQuestionId } from "@/lib/AssessmentQuestions";

interface AssessmentContextProps {
  isLoading: boolean;
  error: string | null;
  assessmentId: AssessmentId;
  assessment?: AssessmentDoc | null;
  selectedQuestionId: AssessmentQuestionId | null;
  setSelectedQuestionId: (id: AssessmentQuestionId | null) => void;
  createBlankAssessmentQuestion: () => void;
}

const initialProps = {
  isLoading: false,
  error: null,
  assessmentId: null ?? ("" as AssessmentId),
  assessment: null,
  selectedQuestionId: null,
  setSelectedQuestionId: () => null,
  createBlankAssessmentQuestion: () => null,
};

export const AssessmentContext =
  createContext<AssessmentContextProps>(initialProps);

interface AssessmentProviderProps {
  children: ReactNode;
  assessmentId: AssessmentId;
}

export const AssessmentProvider = ({
  children,
  assessmentId,
}: AssessmentProviderProps) => {
  // Load Assessment
  const { assessment, isLoading, error } = useAssessment({
    id: assessmentId,
  });

  // Selected question state
  const [selectedQuestionId, setSelectedQuestionId] =
    useState<AssessmentQuestionId | null>(null);

  // Mutation: Create a blank assessment question
  const { createBlankAssessmentQuestion } = useCreateAssessmentQuestion({
    assessmentId,
  });

  return (
    <AssessmentContext.Provider
      value={{
        isLoading,
        error,
        assessmentId,
        assessment,
        selectedQuestionId,
        setSelectedQuestionId,
        createBlankAssessmentQuestion,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessmentContext = () => {
  const assessmentContext = useContext(AssessmentContext);
  return assessmentContext;
};
