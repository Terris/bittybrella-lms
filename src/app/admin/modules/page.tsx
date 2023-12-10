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
        <div className="py-4 px-8 border-b">
          <Text className="text-3xl font-semibold">Modules</Text>
        </div>
        <div className="px-4 w-full max-w-screen-2xl mx-auto">
          <ModulesTable />
        </div>
      </PageContent>
    </>
  );
}
