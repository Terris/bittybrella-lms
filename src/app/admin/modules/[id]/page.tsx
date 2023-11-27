"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { PageContent, PageHeader } from "@/lib/layout";
import { Button, Text } from "@/lib/ui";
import { EditModuleSectionForm } from "./EditModuleSectionForm";
import { CreateModuleSectionButton } from "./CreateModuleSectionButton";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const items = sections.map((section) => section._id);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    updateSectionsOrder({
      idsInOrder: newOrder,
    });
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {sections.map((section) => (
              <SortableItem key={section._id} id={section._id}>
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
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: number | string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="w-full flex flex-row items-center"
    >
      <GripVertical className="flex-shrink-0 w-3 h-3 mr-2" {...listeners} />
      {children}
    </div>
  );
}
