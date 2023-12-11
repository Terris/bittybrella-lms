import React from "react";
import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";
// import {
//   QuickEditAssessmentForm,
//   type AssessmentId,
//   useAssessment,
// } from "@/lib/Assessments";

interface AdminModulePageProps {
  params: { id: string };
  children: React.ReactNode;
}

export function AdminAssessmentLayout({
  params,
  children,
}: AdminModulePageProps) {
  // const { isLoading, assessment } = useAssessment({
  //   id: params.id as AssessmentId,
  // });

  return { children };

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
            <Text className="text-3xl font-bold">{assessment.title}</Text>
            <Text className="text-muted-foreground">
              {assessment.description}
            </Text>
          </div>
          <QuickEditAssessmentForm assessmentId={assessment._id} />
        </div>
        {children}
      </PageContent>
    </>
  );
}
