import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
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
import { cn } from "@/lib/utils";
import { type CourseId } from "@/lib/Courses";
import { ModuleId, ModuleSectionsNav, type ModuleDoc } from "@/lib/Modules";
import {
  type ModuleSectionId,
  type ModuleSectionDoc,
} from "@/lib/ModuleSections";
import { QuickEditCourseModuleForm } from "../forms/QuickEditCourseModuleForm";
import { CourseModuleId } from "../types";

export interface CourseModule extends ModuleDoc {
  sections: ModuleSectionDoc[];
  order: number;
  courseModuleId: CourseModuleId;
}

export function CourseModulesNav({
  courseId,
  modules,
  selectedModuleId,
  setSelectedModuleId,
  selectedModuleSectionId,
  setSelectedModuleSectionId,
}: {
  courseId: CourseId;
  modules: CourseModule[];
  selectedModuleId: ModuleId | null;
  setSelectedModuleId: (id: ModuleId) => void;
  selectedModuleSectionId: ModuleSectionId | null;
  setSelectedModuleSectionId: (id: ModuleSectionId) => void;
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
      idsInOrder: updatedItems as CourseModuleId[],
    });
  }
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row items-center justify-between pb-4">
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
      </div>
      <div className="hidden lg:block">
        <SortableList items={sortItems} onUpdate={handleOnUpdate}>
          <div className="flex flex-col gap-2">
            {modules.map((module) => (
              <SortableListItem
                key={module.courseModuleId}
                id={module.courseModuleId}
              >
                <div className="w-full flex flex-col truncate">
                  <Button
                    key={module._id}
                    variant="ghost"
                    onClick={() => setSelectedModuleId(module?._id)}
                    className={cn(
                      "w-full truncate transition-all",
                      selectedModuleId === module?._id && "font-bold pl-5"
                    )}
                    size="sm"
                  >
                    <div className="w-full text-left truncate">
                      {module.title ?? "Untitled section"}
                    </div>
                  </Button>

                  {selectedModuleId === module?._id && (
                    <div className="pt-2">
                      <ModuleSectionsNav
                        moduleId={selectedModuleId as Id<"modules">}
                        selectedModuleSectionId={selectedModuleSectionId}
                        setSelectedModuleSectionId={setSelectedModuleSectionId}
                        hideHeader
                      />
                    </div>
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
