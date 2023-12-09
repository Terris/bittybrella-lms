"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useAssessment } from "../hooks/useAssessment";
import { useCreateAssessmentQuestion } from "../../AssessmentQuestions/hooks/useCreateAssessmentQuestion";

interface AssessmentContextProps {
  isLoading: boolean;
  error: string | null;
  assessmentId: Id<"assessments">;
  assessment?: Doc<"assessments"> | null;
  selectedQuestionId: Id<"assessmentQuestions"> | null;
  setSelectedQuestionId: (id: Id<"assessmentQuestions"> | null) => void;
  createBlankAssessmentQuestion: () => void;
}

const initialProps = {
  isLoading: false,
  error: null,
  assessmentId: null ?? ("" as Id<"assessments">),
  assessment: null,
  selectedQuestionId: null,
  setSelectedQuestionId: () => null,
  createBlankAssessmentQuestion: () => null,
};

export const AssessmentContext =
  createContext<AssessmentContextProps>(initialProps);

interface AssessmentProviderProps {
  children: ReactNode;
  assessmentId: Id<"assessments">;
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
    useState<Id<"assessmentQuestions"> | null>(null);

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
