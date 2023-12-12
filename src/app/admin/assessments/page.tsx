"use client";

import { AssessmentsTable, QuickCreateAssessmentForm } from "@/lib/Assessments";
import { AdminLayout } from "@/lib/Admin";
import { Breadcrumbs, Text } from "@/lib/ui";

export default function AdminAssessmentsPage() {
  return (
    <>
      <AdminLayout.BreadcrumbsWrapper>
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/assessments", label: "Assessments" },
          ]}
        />
      </AdminLayout.BreadcrumbsWrapper>
      <AdminLayout.PageTitleWrapper align="between">
        <Text className="text-3xl font-bold">Assessments</Text>
        <QuickCreateAssessmentForm />
      </AdminLayout.PageTitleWrapper>
      <AdminLayout.TableWrapper>
        <AssessmentsTable />
      </AdminLayout.TableWrapper>
    </>
  );
}
