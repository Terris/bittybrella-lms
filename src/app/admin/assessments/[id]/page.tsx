"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { FlexRow, Text } from "@/lib/ui";
import { QuickEditAssessmentForm } from "../QuickEditAssessmentForm";

interface AdminModulePageProps {
  params: { id: string };
}

export default function AdminAssessmentPage({ params }: AdminModulePageProps) {
  const assessment = useQuery(api.assessments.findById, {
    id: params.id as Id<"assessments">,
  });

  // TODO: handle loading state
  if (!assessment) return null;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/assessments", label: "Assessments" },
          {
            href: `/admin/assessments/${params.id}`,
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
          <QuickEditAssessmentForm
            assessmentId={params.id as Id<"assessments">}
          />
        </FlexRow>
        <hr />
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-1/4 lg:pr-4">
            <div className="flex flex-col gap-4 lg:sticky lg:top-0">[Nav]</div>
          </aside>
          <div className="flex-1 lg:w-3/4 lg:pl-4">[content]</div>
        </div>
      </PageContent>
    </>
  );
}
