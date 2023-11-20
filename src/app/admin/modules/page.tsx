"use client";

import { PageContent, PageHeader } from "@/lib/layout";
import { CreateModuleForm } from "./CreateModuleForm";
import { ModulesForm } from "./ModulesTable";

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
        <ModulesForm />
      </PageContent>
    </>
  );
}
