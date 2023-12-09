"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { QuickCreateAssessmentForm } from "@/lib/Assessments/forms";
import { AssessmentsTable } from "@/lib/Assessments/views";
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
