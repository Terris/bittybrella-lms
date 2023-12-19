import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { MoreVertical, Plus } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
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
import { cn } from "@/lib/utils";
import {
  type LessonSectionDoc,
  type LessonSectionId,
  useLessonSections,
  useUpdateLessonSectionsOrder,
} from "@/lib/LessonSections";
import { useToast } from "@/lib/hooks";
import { LessonId } from "../../Lessons";
import { SortableAdminNavList } from "@/lib/Admin";

interface LessonSectionsNavProps {
  lessonId: LessonId;
  sectionId?: LessonSectionId | null;
  rootUrl?: string;
  isEditingContentOrder?: boolean;
  asSubNav?: boolean;
}

export function LessonSectionsNav({
  lessonId,
  sectionId,
  rootUrl = "/admin/lessons",
  isEditingContentOrder: isEditingContentOrderProp,
  asSubNav,
}: LessonSectionsNavProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, lessonSections } = useLessonSections({ lessonId });
  const selectedSectionId = sectionId;
  const [isEditingContentOrder, setIsEditingContentOrder] = useState<boolean>(
    isEditingContentOrderProp ?? false
  );

  const sortableListItems = lessonSections?.map((section) => section._id);
  const createLessonSection = useMutation(api.lessonSections.create);

  const { updateLessonSectionsOrder } = useUpdateLessonSectionsOrder({
    lessonId,
  });

  async function handleOnUpdate(updatedItems: string[]) {
    const res = await updateLessonSectionsOrder({
      idsInOrder: updatedItems as LessonSectionId[],
    });
    if (res) {
      toast({
        title: "Success!",
        description: "Updated lesson sections order.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Something went wrong trying to update lesson sections order.",
      });
    }
  }

  const handleCreateNewSection = () => {
    createLessonSection({
      lessonId,
      type: "text",
    });
  };

  // TODO: Add a visual loading state and handle error state
  if (isLoading || !lessonId || !lessonSections || !sortableListItems) {
    return null;
  }

  return (
    <>
      {asSubNav ? null : (
        <div className="flex flex-row items-center justify-between pb-2">
          <Text className="font-bold">Lesson Sections</Text>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleCreateNewSection}>
                Add lesson section
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsEditingContentOrder((i) => !i)}
              >
                {isEditingContentOrder
                  ? "Done editing content order"
                  : "Edit content order"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="hidden lg:flex lg:flex-col lg:gap-1">
        {isEditingContentOrder ? (
          <SortableAdminNavList<LessonSectionDoc, "_id">
            data={lessonSections}
            keyExtractor="_id"
            sortableItemIds={sortableListItems}
            onUpdate={handleOnUpdate}
            renderItem={(section) => (
              <Button
                key={section?._id}
                variant={"ghost"}
                size="sm"
                onClick={() =>
                  router.push(`${rootUrl}/${lessonId}/sections/${section?._id}`)
                }
                className={cn(
                  "w-full truncate transition-all",
                  selectedSectionId === section?._id && "font-bold"
                )}
              >
                <div className={cn("w-full text-left truncate")}>
                  {section?.title ?? "Untitled section"}
                </div>
              </Button>
            )}
          />
        ) : (
          <>
            {lessonSections.map((section) => (
              <Button
                key={section?._id}
                variant={
                  selectedSectionId === section?._id ? "secondary" : "ghost"
                }
                size="sm"
                onClick={() =>
                  router.push(`${rootUrl}/${lessonId}/sections/${section?._id}`)
                }
                className={"w-full truncate transition-all"}
              >
                <div className={cn("w-full text-left truncate")}>
                  {section?.title ?? "Untitled section"}
                </div>
              </Button>
            ))}
          </>
        )}
      </div>
      <div className="block lg:hidden pb-6">
        <LessonSectionsNavSelect
          lessonSections={lessonSections}
          selectedSectionId={selectedSectionId}
          setSelectedSectionId={(sectionid) =>
            router.push(`${rootUrl}/${lessonId}/sections/${sectionid}`)
          }
        />
      </div>
    </>
  );
}

function LessonSectionsNavSelect({
  lessonSections,
  selectedSectionId,
  setSelectedSectionId,
}: {
  lessonSections: LessonSectionDoc[];
  selectedSectionId: LessonSectionId | null | undefined;
  setSelectedSectionId: (id: LessonSectionId | null) => void;
}) {
  return (
    <Select
      onValueChange={(val) => setSelectedSectionId(val as LessonSectionId)}
      value={selectedSectionId as string}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a section" />
      </SelectTrigger>
      <SelectContent>
        {lessonSections.map((section) => (
          <SelectItem value={section._id} key={section._id}>
            {section.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
