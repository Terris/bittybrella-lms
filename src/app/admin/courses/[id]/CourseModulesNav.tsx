import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FlexRow,
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
import { QuickEditCourseModulesForm } from "./QuickEditCourseModulesForm";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { DropdownMenuPortal } from "@radix-ui/react-dropdown-menu";
import { ModuleSectionsNav } from "../../modules/[id]/ModuleSectionsNav";

export interface CourseModule extends Doc<"modules"> {
  sections: Doc<"moduleSections">[];
  order: number;
  courseModuleId: Id<"courseModules">;
}

export function CourseModulesNav({
  courseId,
  modules,
  selectedModuleId,
  setSelectedModuleId,
  selectedModuleSectionId,
  setSelectedModuleSectionId,
}: {
  courseId: Id<"courses">;
  modules: CourseModule[];
  selectedModuleId: Id<"modules"> | null;
  setSelectedModuleId: (id: Id<"modules">) => void;
  selectedModuleSectionId: Id<"moduleSections"> | null;
  setSelectedModuleSectionId: (id: Id<"moduleSections">) => void;
}) {
  const sortItems = modules.map((module) => module.courseModuleId);

  const updateCourseModulesOrder = useMutation(
    api.courseModules.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    const { idsInOrder } = args;

    const updatedModules = modules
      .map((module) => ({
        ...module,
        order: idsInOrder.indexOf(module.courseModuleId) + 1,
      }))
      .sort((a, b) => a.order - b.order);
    const currentValue = localStore.getQuery(api.courses.findById, {
      id: courseId,
    });
    if (currentValue !== undefined) {
      localStore.setQuery(
        api.courses.findById,
        {
          id: courseId,
        },
        { ...currentValue, modules: updatedModules }
      );
    }
  });

  function handleOnUpdate(updatedItems: string[]) {
    updateCourseModulesOrder({
      idsInOrder: updatedItems as Id<"courseModules">[],
    });
  }
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <>
      <FlexRow className="justify-between">
        <Text className="font-bold">Course Modules</Text>
        <DropdownMenu open={menuIsOpen} onOpenChange={setMenuIsOpen}>
          <DropdownMenuTrigger>
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <QuickEditCourseModulesForm
                courseId={courseId}
                onCloseForm={() => setMenuIsOpen(false)}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </FlexRow>
      <div className="hidden lg:block">
        <SortableList items={sortItems} onUpdate={handleOnUpdate}>
          <div className="flex flex-col gap-2">
            {modules.map((module) => (
              <SortableListItem
                key={module.courseModuleId}
                id={module.courseModuleId}
              >
                <div className="flex flex-col flex-1 truncate">
                  <Button
                    key={module._id}
                    variant={
                      selectedModuleId === module?._id ? "secondary" : "ghost"
                    }
                    onClick={() => setSelectedModuleId(module?._id)}
                    className="flex-1 truncate mb-1"
                  >
                    <div className="w-full text-left truncate">
                      {module.title ?? "Untitled section"}
                    </div>
                  </Button>
                  {selectedModuleId === module?._id && (
                    <ModuleSectionsNav
                      moduleId={selectedModuleId as Id<"modules">}
                      selectedModuleSectionId={selectedModuleSectionId}
                      setSelectedModuleSectionId={setSelectedModuleSectionId}
                      hideHeader
                    />
                  )}
                </div>
              </SortableListItem>
            ))}
          </div>
        </SortableList>
      </div>
      <div className="block lg:hidden pb-6">
        <Select
          onValueChange={(val) => setSelectedModuleId(val as Id<"modules">)}
          value={selectedModuleId as string}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((module) => (
              <SelectItem value={module._id} key={module._id}>
                {module.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
