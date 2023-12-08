"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

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
  // Assessment
  const assessment = useQuery(api.assessments.findById, { id: assessmentId });
  const isLoading = !assessment;
  const error = !isLoading && !assessment ? "Error loading assessment" : null;

  // Selected question
  const [selectedQuestionId, setSelectedQuestionId] =
    useState<Id<"assessmentQuestions"> | null>(null);

  // Create a blank assessment question
  const createAssessmentQuestionMutation = useMutation(
    api.assessmentQuestions.create
  );
  const createBlankAssessmentQuestion = () =>
    createAssessmentQuestionMutation({
      assessmentId,
      question: "Blank question",
      options: [],
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
