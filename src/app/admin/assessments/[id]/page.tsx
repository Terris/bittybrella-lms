"use client";

import React from "react";
import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";
import {
  QuickEditAssessmentForm,
  AssessmentProvider,
  useAssessmentContext,
  type AssessmentId,
} from "@/lib/Assessments";
import { AssessmentQuestionsNav } from "@/lib/AssessmentQuestions";

interface AdminModulePageProps {
  params: { id: string };
}

export default function AdminAssessmentPage({ params }: AdminModulePageProps) {
  return (
    <AssessmentProvider assessmentId={params.id as AssessmentId}>
      <AdminAssessmentPageContent />
    </AssessmentProvider>
  );
}

function AdminAssessmentPageContent() {
  const { isLoading, assessment, selectedQuestionId } = useAssessmentContext();

  if (isLoading || !assessment) return null;

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/assessments", label: "Assessments" },
            {
              href: `/admin/assessments/${assessment._id}`,
              label: assessment.title ?? "Untitled Assessment",
            },
          ]}
        />
      </div>
      <PageContent>
        <div className="w-full flex flex-row items-center justify-start py-4 px-8 border-b">
          <div className="mr-4">
            <Text className="text-3xl font-semibold">{assessment.title}</Text>
            <Text className="text-muted-foreground">
              {assessment.description}
            </Text>
          </div>
          <QuickEditAssessmentForm assessmentId={assessment._id} />
        </div>
        <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
          <aside className="px-4 lg:w-1/5 lg:pl-8">
            <div className="sticky top-0">
              <AssessmentQuestionsNav />
            </div>
          </aside>
          <div className="px-4 lg:w-4/5 lg:pr-8">
            <div className="flex flex-col gap-4 max-w-4xl">
              {selectedQuestionId}
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}
