import React from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from "@/lib/ui";
import {
  SortableList,
  SortableListItem,
} from "@/lib/providers/SortableListProvider";
import { MoreVertical } from "lucide-react";
import { CreateModuleSectionButton } from "./CreateModuleSectionButton";

export function ModuleSectionsNav({
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
      <div className="flex items-center justify-between">
        <Text className="font-bold">Module Sections</Text>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <CreateModuleSectionButton moduleId={moduleId} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden lg:block">
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
      </div>
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
