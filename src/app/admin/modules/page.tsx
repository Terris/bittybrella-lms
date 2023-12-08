"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { CreateModuleForm } from "../../../lib/modules/CreateModuleForm";
import { ModulesTable } from "../../../lib/modules/ModulesTable";
import { Text } from "@/lib/ui";

export default function AdminModulesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/modules", label: "Modules" },
        ]}
        renderActions={<CreateModuleForm />}
      />
      <PageContent>
        <Text className="text-2xl font-semibold">Modules</Text>
        <hr />
        <ModulesTable />
      </PageContent>
    </>
  );
}
