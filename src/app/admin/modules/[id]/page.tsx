"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { Button, Text } from "@/lib/ui";
import { EditModuleSectionForm } from "./EditModuleSectionForm";
import { CreateModuleSectionForm } from "./CreateModuleSectionButton";

interface AdminModulePageProps {
  params: { id: string };
}

export default function AdminModulePage({ params }: AdminModulePageProps) {
  const moduleData = useQuery(api.modules.getWithSections, {
    id: params.id as Id<"modules">,
  });

  const [currentModuleSectionId, setCurrentModuleSectionId] =
    useState<Id<"moduleSections"> | null>(null);

  useEffect(() => {
    if (!moduleData?.sections?.[0]?._id || !!currentModuleSectionId) return;
    setCurrentModuleSectionId(moduleData?.sections?.[0]._id ?? null);
  }, [moduleData?.sections, currentModuleSectionId]);

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
          <aside className="lg:w-1/5 pr-4">
            <Text className="font-bold pb-4">Module Sections</Text>
            {moduleData.sections?.map((section) => (
              <Button
                key={section?._id}
                variant={
                  currentModuleSectionId === section?._id
                    ? "secondary"
                    : "ghost"
                }
                onClick={() => setCurrentModuleSectionId(section?._id)}
                className="w-full mb-4 text-left"
              >
                <div className="w-full text-left truncate">
                  {section?.title ?? "Untitled section"}
                </div>
              </Button>
            ))}
            <CreateModuleSectionForm moduleId={params.id as Id<"modules">} />
          </aside>
          <div className="flex-1 lg:w-4/5 pl-4">
            {currentModuleSectionId && (
              <EditModuleSectionForm id={currentModuleSectionId} />
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
}
