import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/ui";
import {
  SortableList,
  SortableListItem,
} from "@/lib/providers/SortableListProvider";
import { MoreVertical, PlusCircle } from "lucide-react";

export function ModuleSectionsNav({
  moduleId,
  selectedModuleSectionId,
  setSelectedModuleSectionId,
  hideHeader,
}: {
  moduleId: Id<"modules">;
  selectedModuleSectionId: Id<"moduleSections"> | null;
  setSelectedModuleSectionId: (id: Id<"moduleSections">) => void;
  hideHeader?: boolean;
}) {
  const sections = useQuery(api.moduleSections.findByModuleId, {
    moduleId,
  });

  const createModuleSection = useMutation(api.moduleSections.create);

  const sortItems = sections?.map((section) => section._id);

  const updateSectionsOrder = useMutation(
    api.moduleSections.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    if (!sections) return;
    const { idsInOrder } = args;
    const updatedModuleSections = sections
      .map((section) => ({
        ...section,
        order: idsInOrder.indexOf(section._id) + 1,
      }))
      .sort((a, b) => a.order - b.order);
    const currentValue = localStore.getQuery(
      api.moduleSections.findByModuleId,
      {
        moduleId,
      }
    );
    if (currentValue !== undefined) {
      localStore.setQuery(
        api.moduleSections.findByModuleId,
        {
          moduleId,
        },
        [...updatedModuleSections]
      );
    }
  });

  function handleOnUpdate(updatedItems: string[]) {
    updateSectionsOrder({
      idsInOrder: updatedItems as Id<"moduleSections">[],
    });
  }

  const handleCreateNewSection = () => {
    createModuleSection({
      moduleId,
      type: "text",
    });
  };

  if (!sections || !sortItems) return null;

  return (
    <>
      {hideHeader ? null : (
        <div className="flex items-center justify-between">
          <Text className="font-bold">Module Sections</Text>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleCreateNewSection}>
                  Add module section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      )}

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
                  size="sm"
                  onClick={() => setSelectedModuleSectionId(section?._id)}
                  className="flex-1 truncate"
                >
                  <div className="w-full text-left truncate">
                    {section?.title ?? "Untitled section"}
                  </div>
                </Button>
              </SortableListItem>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateNewSection}
                  className="ml-5"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add module section</TooltipContent>
            </Tooltip>
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
