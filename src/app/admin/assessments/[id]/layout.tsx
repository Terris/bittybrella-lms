"use client";

import React from "react";
import { AdminLayout } from "@/lib/Admin";
import { Breadcrumbs, Text } from "@/lib/ui";
import {
  type AssessmentId,
  QuickEditAssessmentForm,
  useAssessment,
} from "@/lib/Assessments";
import {
  AssessmentQuestionId,
  AssessmentQuestionsNav,
} from "@/lib/AssessmentQuestions";
import { useParams } from "next/navigation";

interface AdminAssessmentLayoutProps {
  children: React.ReactNode;
}

export default function AdminAssessmentLayout({
  children,
}: AdminAssessmentLayoutProps) {
  const { id, questionId } = useParams();
  const { isLoading, assessment } = useAssessment({
    id: id as AssessmentId,
  });

  if (isLoading || !assessment) return null;

  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
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
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper>
        <div className="mr-4">
          <Text className="text-3xl font-bold">{assessment.title}</Text>
          <Text className="text-muted-foreground">
            {assessment.description}
          </Text>
        </div>
        <QuickEditAssessmentForm assessmentId={assessment._id} />
      </AdminLayout.PageTitleWrapper>
      <AdminLayout.NavAndContentFlexWrapper>
        <AdminLayout.NavWrapper>
          <AssessmentQuestionsNav
            assessmentId={id as AssessmentId}
            questionId={questionId as AssessmentQuestionId}
          />
        </AdminLayout.NavWrapper>
        <AdminLayout.ContentWrapper>{children}</AdminLayout.ContentWrapper>
      </AdminLayout.NavAndContentFlexWrapper>
    </>
  );
}
