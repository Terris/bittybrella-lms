"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { Button, Text } from "@/lib/ui";
import { EditModuleSectionForm } from "./EditModuleSectionForm";
import { CreateModuleSectionButton } from "./CreateModuleSectionButton";

interface AdminModulePageProps {
  params: { id: string };
}

export default function AdminModulePage({ params }: AdminModulePageProps) {
  const moduleData = useQuery(api.modules.findById, {
    id: params.id as Id<"modules">,
  });

  const [selectedModuleSectionId, setSelectedModuleSectionId] =
    useState<Id<"moduleSections"> | null>(null);

  useEffect(() => {
    if (
      (selectedModuleSectionId &&
        moduleData?.sections.some((s) => s._id === selectedModuleSectionId)) || // If the current section is still in the list
      !moduleData?.sections?.[0]?._id
    ) {
      return;
    }
    setSelectedModuleSectionId(moduleData?.sections?.[0]._id ?? null);
  }, [moduleData?.sections, selectedModuleSectionId]);

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
          <Text className="text-2xl font-semibold">{moduleData.title}</Text>
          <Text className="text-muted-foreground">
            {moduleData.description}
          </Text>
        </div>
        <hr />
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-1/4 lg:pr-4">
            <div className="lg:sticky lg:top-0">
              <ModuleSectionNav
                moduleId={params.id as Id<"modules">}
                sections={moduleData.sections}
                selectedModuleSectionId={selectedModuleSectionId}
                setSelectedModuleSectionId={setSelectedModuleSectionId}
              />
            </div>
          </aside>
          <div className="flex-1 lg:w-3/4 pl-4">
            {selectedModuleSectionId && (
              <EditModuleSectionForm id={selectedModuleSectionId} />
            )}
          </div>
        </div>
      </PageContent>
    </>
  );
}

function ModuleSectionNav({
  moduleId,
  sections,
  selectedModuleSectionId,
  setSelectedModuleSectionId,
}: {
  moduleId: Id<"modules">;
  sections: Doc<"moduleSections">[];
  selectedModuleSectionId: Id<"moduleSections"> | null;
  setSelectedModuleSectionId: (id: Id<"moduleSections">) => void;
}) {
  return (
    <div>
      <Text className="font-bold pt-2 pb-4">Module Sections</Text>
      {sections?.map((section) => (
        <Button
          key={section?._id}
          variant={
            selectedModuleSectionId === section?._id ? "secondary" : "ghost"
          }
          onClick={() => setSelectedModuleSectionId(section?._id)}
          className="w-full mb-4 text-left"
        >
          <div className="w-full text-left truncate">
            {section.order}. {section?.title ?? "Untitled section"}
          </div>
        </Button>
      ))}
      <CreateModuleSectionButton moduleId={moduleId} />
    </div>
  );
}
