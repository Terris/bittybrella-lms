"use client";

import React from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { FlexRow, Text } from "@/lib/ui";
import { QuickEditAssessmentForm } from "../../../../lib/assessments/QuickEditAssessmentForm";
import {
  AssessmentProvider,
  useAssessment,
} from "../../../../lib/assessments/AssessmentProvider";
import { AssessmentQuestionsNav } from "../../../../lib/assessments/AssessmentQuestionsNav";

interface AdminModulePageProps {
  params: { id: string };
}

export default function AdminAssessmentPage({ params }: AdminModulePageProps) {
  return (
    <AssessmentProvider assessmentId={params.id as Id<"assessments">}>
      <AdminAssessmentPageContent />
    </AssessmentProvider>
  );
}

function AdminAssessmentPageContent() {
  const { isLoading, assessment, selectedQuestionId } = useAssessment();

  if (isLoading || !assessment) return null;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/assessments", label: "Assessments" },
          {
            href: `/admin/assessments/${assessment._id}`,
            label: assessment.title ?? "Untitled Assessment",
          },
        ]}
      />
      <PageContent>
        <FlexRow className="justify-between">
          <div className="space-y-0.5">
            <Text className="text-2xl font-semibold">{assessment.title}</Text>
            <Text className="text-muted-foreground">
              {assessment.description}
            </Text>
          </div>
          <QuickEditAssessmentForm assessmentId={assessment._id} />
        </FlexRow>
        <hr />
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-1/4 lg:pr-4 lg:pt-2">
            <AssessmentQuestionsNav />
          </aside>
          <div className="flex-1 lg:w-3/4 lg:pl-4">{selectedQuestionId}</div>
        </div>
      </PageContent>
    </>
  );
}
