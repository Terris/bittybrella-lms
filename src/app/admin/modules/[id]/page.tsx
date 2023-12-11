"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent } from "@/lib/layout";
import { Breadcrumbs, Text } from "@/lib/ui";
import { EditModuleSectionForm } from "@/lib/ModuleSections/forms/EditModuleSectionForm";
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
      <div className="w-full flex flex-row items-center justify-between py-2 px-8 border-b">
        <Breadcrumbs
          breadcrumbs={[
            { href: "/admin", label: "Admin" },
            { href: "/admin/modules", label: "Modules" },
            {
              href: `/admin/modules/${params.id}`,
              label: moduleData.title ?? "Untitled Module",
            },
          ]}
        />
      </div>
      <PageContent>
        <div className="w-full flex flex-row items-center justify-start py-4 px-8 border-b">
          <div className="mr-4">
            <Text className="text-3xl font-semibold">{moduleData.title}</Text>
            <Text className="text-muted-foreground">
              {moduleData.description}
            </Text>
          </div>
          <QuickEditModuleForm moduleId={params.id as Id<"modules">} />
        </div>
        <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
          <aside className="px-4 lg:w-1/5 lg:pl-8">
            <div className="sticky top-0">
              <ModuleSectionsNav
                moduleId={params.id as Id<"modules">}
                selectedModuleSectionId={selectedModuleSectionId}
                setSelectedModuleSectionId={setSelectedModuleSectionId}
              />
            </div>
          </aside>
          <div className="px-4 lg:w-4/5 lg:pr-8">
            <div className="flex flex-col gap-4  max-w-4xl">
              {selectedModuleSectionId && (
                <EditModuleSectionForm id={selectedModuleSectionId} />
              )}
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}
