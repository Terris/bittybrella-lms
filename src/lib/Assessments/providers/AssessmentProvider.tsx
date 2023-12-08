"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { useAssessmentLoader } from "../hooks/useAssessmentLoader";
import { useCreateAssessmentQuestion } from "../../AssessmentQuestions/hooks/useCreateAssessmentQuestion";

export interface Assessment extends Doc<"assessments"> {
  questions: Doc<"assessmentQuestions">[];
}

interface AssessmentContextProps {
  isLoading: boolean;
  error: string | null;
  assessment?: Assessment | null;
  selectedQuestionId: Id<"assessmentQuestions"> | null;
  setSelectedQuestionId: (id: Id<"assessmentQuestions"> | null) => void;
  createBlankAssessmentQuestion: () => void;
}

const initialProps = {
  isLoading: false,
  error: null,
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
  // Loader: Assessment
  const { assessment, isLoading, error } = useAssessmentLoader({
    id: assessmentId,
  });

  // State: Selected question
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

export const useAssessment = () => {
  const assessmentContext = useContext(AssessmentContext);
  return assessmentContext;
};
