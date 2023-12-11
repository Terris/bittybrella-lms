"use client";

import { PageContent } from "@/lib/layout";
import { AssessmentsTable, QuickCreateAssessmentForm } from "@/lib/Assessments";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function AdminAssessmentsPage() {
  return (
    <>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/assessments", label: "Assessments" },
          ]}
        />
      </div>
      <PageContent>
        <div className="py-4 px-8 border-b flex flex-row items-center justify-between">
          <Text className="text-3xl font-semibold">Assessments</Text>
          <QuickCreateAssessmentForm />
        </div>
        <div className="px-4 w-full max-w-screen-2xl mx-auto">
          <AssessmentsTable />
        </div>
      </PageContent>
    </>
  );
}
