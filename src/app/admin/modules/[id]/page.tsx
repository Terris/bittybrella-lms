"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from "@/lib/ui";
import { EditModuleSectionForm } from "./EditModuleSectionForm";
import { CreateModuleSectionButton } from "./CreateModuleSectionButton";
import {
  SortableList,
  SortableListItem,
} from "@/lib/providers/SortableListProvider";

interface AdminModulePageProps {
  params: { id: string };
}

export default function AdminModulePage({ params }: AdminModulePageProps) {
  const moduleData = useQuery(api.modules.findById, {
    id: params.id as Id<"modules">,
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
        <div className="space-y-0.5">
          <Text className="text-2xl font-semibold">{moduleData.title}</Text>
          <Text className="text-muted-foreground">
            {moduleData.description}
          </Text>
        </div>
        <hr />
        <div className="flex flex-col lg:flex-row">
          <aside className="lg:w-1/4 lg:pr-4">
            <div className="flex flex-col gap-4 lg:sticky lg:top-0">
              <Text className="font-bold pt-2">Module Sections</Text>
              <ModuleSectionNav
                moduleId={params.id as Id<"modules">}
                sections={moduleData.sections}
                selectedModuleSectionId={selectedModuleSectionId}
                setSelectedModuleSectionId={setSelectedModuleSectionId}
              />
              <CreateModuleSectionButton
                moduleId={params.id as Id<"modules">}
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
  const sortItems = sections.map((section) => section._id);

  const updateSectionsOrder = useMutation(
    api.moduleSections.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    const { idsInOrder } = args;
    const updatedModuleSections = sections
      .map((section, index) => ({
        ...section,
        order: idsInOrder.indexOf(section._id) + 1,
      }))
      .sort((a, b) => a.order - b.order);
    const currentValue = localStore.getQuery(api.modules.findById, {
      id: moduleId,
    });
    if (currentValue !== undefined) {
      localStore.setQuery(
        api.modules.findById,
        {
          id: moduleId,
        },
        { ...currentValue, sections: updatedModuleSections }
      );
    }
  });

  function handleOnUpdate(updatedItems: string[]) {
    updateSectionsOrder({
      idsInOrder: updatedItems as Id<"moduleSections">[],
    });
  }

  return (
    <>
      <SortableList items={sortItems} onUpdate={handleOnUpdate}>
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <SortableListItem key={section._id} id={section._id}>
              <Button
                key={section?._id}
                variant={
                  selectedModuleSectionId === section?._id
                    ? "secondary"
                    : "ghost"
                }
                onClick={() => setSelectedModuleSectionId(section?._id)}
                className="flex-1 truncate"
              >
                <div className="w-full text-left truncate">
                  {section.order}. {section?.title ?? "Untitled section"}
                </div>
              </Button>
            </SortableListItem>
          ))}
        </div>
      </SortableList>
      <div className="block lg:hidden pb-6">
        <Select
          onValueChange={(val) =>
            setSelectedModuleSectionId(val as Id<"moduleSections">)
          }
          value={selectedModuleSectionId as string}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem value={section._id} key={section._id}>
                {section.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
