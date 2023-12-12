import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { MoreVertical, Plus } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
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
} from "@/lib/ui";
import {
  SortableList,
  SortableListItem,
} from "@/lib/providers/SortableListProvider";
import { cn } from "@/lib/utils";
import {
  type ModuleSectionDoc,
  type ModuleSectionId,
  useModuleSections,
  useUpdateModuleSectionsOrder,
} from "@/lib/ModuleSections";
import { useToast } from "@/lib/hooks";
import { ModuleId } from "../../Modules";

interface ModuleSectionsNavProps {
  moduleId: ModuleId;
  sectionId?: ModuleSectionId | null;
  hideHeader?: boolean;
  rootUrl?: string;
}

export function ModuleSectionsNav({
  moduleId,
  sectionId,
  hideHeader,
  rootUrl = "/admin/modules",
}: ModuleSectionsNavProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, moduleSections } = useModuleSections({ moduleId });
  const selectedSectionId = sectionId;

  const sortableListItems = moduleSections?.map((section) => section._id);
  const createModuleSection = useMutation(api.moduleSections.create);

  const { updateModuleSectionsOrder } = useUpdateModuleSectionsOrder({
    moduleId,
  });

  async function handleOnUpdate(updatedItems: string[]) {
    const res = await updateModuleSectionsOrder({
      idsInOrder: updatedItems as ModuleSectionId[],
    });
    if (res) {
      toast({
        title: "Success!",
        description: "Updated module sections order.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Something went wrong trying to update module sections order.",
      });
    }
  }

  const handleCreateNewSection = () => {
    createModuleSection({
      moduleId,
      type: "text",
    });
  };

  // TODO: Add a visual loading state and handle error state
  if (isLoading || !module || !moduleSections || !sortableListItems) {
    return null;
  }

  return (
    <>
      {hideHeader ? null : (
        <div className="flex flex-row items-center justify-between pb-2">
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
        <SortableList items={sortableListItems} onUpdate={handleOnUpdate}>
          <div className="flex flex-col gap-1">
            {moduleSections.map((section) => (
              <SortableListItem key={section._id} id={section._id}>
                <Button
                  key={section?._id}
                  variant={"ghost"}
                  size="sm"
                  onClick={() =>
                    router.push(
                      `${rootUrl}/${moduleId}/sections/${section?._id}`
                    )
                  }
                  className={cn(
                    "w-full truncate transition-all",
                    selectedSectionId === section?._id && "font-bold pl-5"
                  )}
                >
                  <div className="w-full text-left truncate">
                    {section?.title ?? "Untitled section"}
                  </div>
                </Button>
              </SortableListItem>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateNewSection}
              className="ml-5 justify-start italic"
            >
              <Plus className="h-3 w-3 mr-1" /> Add new module section
            </Button>
          </div>
        </SortableList>
      </div>
      <div className="block lg:hidden pb-6">
        <ModuleSectionsNavSelect
          moduleSections={moduleSections}
          selectedSectionId={selectedSectionId}
          setSelectedSectionId={(sectionid) =>
            router.push(`${rootUrl}/${moduleId}/sections/${sectionid}`)
          }
        />
      </div>
    </>
  );
}

function ModuleSectionsNavSelect({
  moduleSections,
  selectedSectionId,
  setSelectedSectionId,
}: {
  moduleSections: ModuleSectionDoc[];
  selectedSectionId: ModuleSectionId | null | undefined;
  setSelectedSectionId: (id: ModuleSectionId | null) => void;
}) {
  return (
    <Select
      onValueChange={(val) => setSelectedSectionId(val as ModuleSectionId)}
      value={selectedSectionId as string}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a section" />
      </SelectTrigger>
      <SelectContent>
        {moduleSections.map((section) => (
          <SelectItem value={section._id} key={section._id}>
            {section.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
