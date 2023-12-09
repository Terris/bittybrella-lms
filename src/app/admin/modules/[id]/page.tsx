"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { FlexRow, Text } from "@/lib/ui";
import { EditModuleSectionForm } from "@/lib/ModuleSection/forms/EditModuleSectionForm";
import {
  type ModuleId,
  ModuleSectionsNav,
  QuickEditModuleForm,
} from "@/lib/Modules";

interface AdminModulePageProps {
  params: { id: string };
}

export default function AdminModulePage({ params }: AdminModulePageProps) {
  const moduleData = useQuery(api.modules.findById, {
    id: params.id as ModuleId,
  });

  const [selectedModuleSectionId, setSelectedModuleSectionId] =
    useState<Id<"moduleSections"> | null>(null);

  // set the default selected section to the first section
  // on load and when a section is deleted
  useEffect(() => {
    if (
      (selectedModuleSectionId &&
        moduleData?.sections.some((s) => s._id === selectedModuleSectionId)) ||
      !moduleData?.sections?.[0]?._id
    ) {
      return;
    }
    setSelectedModuleSectionId(moduleData?.sections?.[0]._id ?? null);
  }, [moduleData?.sections, selectedModuleSectionId]);

  // TODO: handle loading state
  if (!moduleData) return null;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/modules", label: "Modules" },
          {
            href: `/admin/modules/${params.id}`,
            label: moduleData.title ?? "Untitled Module",
          },
        ]}
      />
      <PageContent>
        <FlexRow className="justify-between">
          <div className="space-y-0.5">
            <Text className="text-2xl font-semibold">{moduleData.title}</Text>
            <Text className="text-muted-foreground">
              {moduleData.description}
            </Text>
          </div>
          <QuickEditModuleForm moduleId={params.id as Id<"modules">} />
        </FlexRow>
        <hr />
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-1/4 lg:pr-4">
            <div className="flex flex-col gap-4 lg:sticky lg:top-0">
              <ModuleSectionsNav
                moduleId={params.id as Id<"modules">}
                selectedModuleSectionId={selectedModuleSectionId}
                setSelectedModuleSectionId={setSelectedModuleSectionId}
              />
            </div>
          </aside>
          <div className="flex-1 lg:w-3/4 lg:pl-4">
            {selectedModuleSectionId && (
              <EditModuleSectionForm id={selectedModuleSectionId} />
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
}
