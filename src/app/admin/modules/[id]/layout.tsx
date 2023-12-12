"use client";

import React from "react";
import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";
import { type ModuleId, QuickEditModuleForm, useModule } from "@/lib/Modules";

interface AdminModuleLayoutProps {
  params: { id: string };
  children: React.ReactNode;
}

export default function AdminModuleLayout({
  params,
  children,
}: AdminModuleLayoutProps) {
  const { isLoading, moduleData } = useModule({
    id: params.id as ModuleId,
  });

  if (isLoading || !moduleData) return null;

  return (
    <PageContent>
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/modules", label: "Modules" },
            {
              href: `/admin/modules/${moduleData._id}`,
              label: moduleData.title ?? "Untitled Assessment",
            },
          ]}
        />
      </div>
      <div className="w-full flex flex-row items-center justify-start py-4 px-8 border-b">
        <div className="mr-4">
          <Text className="text-3xl font-bold">{moduleData.title}</Text>
          <Text className="text-muted-foreground">
            {moduleData.description}
          </Text>
        </div>
        <QuickEditModuleForm moduleId={moduleData._id} />
      </div>
      {children}
    </PageContent>
  );
}
