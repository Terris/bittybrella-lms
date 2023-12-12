import { useState } from "react";
import { MoreVertical } from "lucide-react";
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
import { ModuleId, type ModuleDoc } from "@/lib/Modules";
import { ModuleSectionsNav, type ModuleSectionId } from "@/lib/ModuleSections";
import { QuickEditCourseModuleForm } from "../forms/QuickEditCourseModuleForm";
import { CourseModuleId } from "../types";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks";
import { useCourseModules, useUpdateCourseModulesOrder } from "../hooks";

export interface CourseModule extends ModuleDoc {
  order: number;
  courseModuleId: CourseModuleId;
}

export function CourseModulesNav({
  courseId,
  moduleId,
  moduleSectionId,
}: {
  courseId: CourseId;
  moduleId?: ModuleId;
  moduleSectionId?: ModuleSectionId;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const selectedModuleId = moduleId;
  const selectedSectionId = moduleSectionId;
  console.log(selectedSectionId);

  const { isLoading, courseModules } = useCourseModules({
    courseId,
  });

  const sortableListItems = courseModules?.map(
    (courseModule) => courseModule._id
  );

  const { updateCourseModulesOrder } = useUpdateCourseModulesOrder({
    courseId,
  });

  // Note that we're sorting courseModule._ids, not courseModule.module
  async function handleOnUpdate(updatedItems: string[]) {
    const res = await updateCourseModulesOrder({
      idsInOrder: updatedItems as CourseModuleId[],
    });
    if (res) {
      toast({
        title: "Success!",
        description: "Updated course module order.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Something went wrong trying to update course module order.",
      });
    }
  }

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  if (isLoading || !courseModules || !sortableListItems) {
    return null;
  }

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
        <SortableList items={sortableListItems} onUpdate={handleOnUpdate}>
          <div className="flex flex-col gap-2">
            {courseModules.map((courseModule) => (
              <SortableListItem key={courseModule._id} id={courseModule._id}>
                <div className="w-full flex flex-col truncate">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(
                        `/admin/courses/${courseId}/modules/${courseModule.moduleId}/sections`
                      )
                    }
                    className={cn(
                      "w-full truncate transition-all",
                      selectedModuleId === courseModule.moduleId &&
                        "font-bold pl-5"
                    )}
                    size="sm"
                  >
                    <div className="w-full text-left truncate">
                      {courseModule.moduleDoc?.title ?? "Untitled section"}
                    </div>
                  </Button>
                  {selectedModuleId === courseModule.moduleId && (
                    <div className="pt-2">
                      <ModuleSectionsNav
                        moduleId={selectedModuleId}
                        sectionId={selectedSectionId}
                        hideHeader
                        rootUrl={`/admin/courses/${courseId}/modules`}
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
          onValueChange={(moduleId) =>
            router.push(`/admin/courses/${courseId}/modules/${moduleId}`)
          }
          value={selectedModuleId as string}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            {courseModules.map((courseModule) => (
              <SelectItem
                value={courseModule.moduleId}
                key={courseModule.moduleId}
              >
                {courseModule.moduleDoc?.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
