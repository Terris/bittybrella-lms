"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { AssessmentsTable, QuickCreateAssessmentForm } from "@/lib/Assessments";
import { Text } from "@/lib/ui";

export default function AdminAssessmentsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/assessments", label: "Assessments" },
        ]}
        renderActions={<QuickCreateAssessmentForm />}
      />
      <PageContent>
        <div className="py-4 px-8 border-b">
          <Text className="text-3xl font-semibold">Assessments</Text>
        </div>
        <div className="px-4 w-full max-w-screen-2xl mx-auto">
          <AssessmentsTable />
        </div>
      </PageContent>
    </>
  );
}
