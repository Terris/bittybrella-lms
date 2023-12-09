import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FlexColumn,
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
import { QuickEditCourseModuleForm } from "./QuickEditCourseModuleForm";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { ModuleSectionsNav } from "../Modules/views/ModuleSectionsNav";
import { cn } from "@/lib/utils";

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
      <FlexRow className="justify-between pb-4">
        <Text className="font-bold">Course Modules</Text>
        <DropdownMenu open={menuIsOpen} onOpenChange={setMenuIsOpen}>
          <DropdownMenuTrigger>
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <QuickEditCourseModuleForm
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
                <FlexColumn className="w-full truncate">
                  <Button
                    key={module._id}
                    variant="ghost"
                    onClick={() => setSelectedModuleId(module?._id)}
                    className={cn(
                      "w-full truncate mb-2 transition-all",
                      selectedModuleId === module?._id && "font-bold pl-5"
                    )}
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
                </FlexColumn>
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
