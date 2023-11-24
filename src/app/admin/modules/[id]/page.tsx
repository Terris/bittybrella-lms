"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { Text } from "@/lib/ui";
import { ContentEditor } from "../../../../lib/ui/ContentEditor";

interface AdminModulePageProps {
  params: { id: string };
}

export default function AdminModulePage({ params }: AdminModulePageProps) {
  const moduleData = useQuery(api.modules.get, {
    id: params.id as Id<"modules">,
  });

  if (!moduleData) return null;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/modules", label: "Modules" },
          { href: `/admin/modules/${params.id}`, label: moduleData.title },
        ]}
      />
      <PageContent>
        <div className="space-y-0.5">
          <Text className="text-2xl font-bold tracking-tight">
            {moduleData.title}
          </Text>
          <Text className="text-muted-foreground">
            {moduleData.description}
          </Text>
        </div>
        <hr />
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-1/5">Sections</aside>
          <div className="flex-1">
            <ContentEditor />
          </div>
        </div>
      </PageContent>
    </>
  );
}
