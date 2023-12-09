"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { QuickCreateModuleForm, ModulesTable } from "@/lib/Modules";
import { Text } from "@/lib/ui";

export default function AdminModulesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/modules", label: "Modules" },
        ]}
        renderActions={<QuickCreateModuleForm />}
      />
      <PageContent>
        <Text className="text-2xl font-semibold">Modules</Text>
        <hr />
        <ModulesTable />
      </PageContent>
    </>
  );
}
