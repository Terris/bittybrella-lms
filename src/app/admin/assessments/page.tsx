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
        <Text className="text-2xl font-semibold">Assessments</Text>
        <hr />
        <AssessmentsTable />
      </PageContent>
    </>
  );
}
