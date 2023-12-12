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
import { LessonId, type LessonDoc } from "@/lib/Lessons";
import { LessonSectionsNav, type LessonSectionId } from "@/lib/LessonSections";
import { QuickEditCourseLessonForm } from "../forms/QuickEditCourseLessonForm";
import { CourseLessonId } from "../types";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks";
import { useCourseLessons, useUpdateCourseLessonsOrder } from "../hooks";

export interface CourseLesson extends LessonDoc {
  order: number;
  courseLessonId: CourseLessonId;
}

export function CourseLessonsNav({
  courseId,
  lessonId,
  lessonSectionId,
}: {
  courseId: CourseId;
  lessonId?: LessonId;
  lessonSectionId?: LessonSectionId;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const selectedLessonId = lessonId;
  const selectedSectionId = lessonSectionId;

  const { isLoading, courseLessons } = useCourseLessons({
    courseId,
  });

  const sortableListItems = courseLessons?.map(
    (courseLesson) => courseLesson._id
  );

  const { updateCourseLessonsOrder } = useUpdateCourseLessonsOrder({
    courseId,
  });

  // Note that we're sorting courseLesson._ids, not courseLesson.lesson
  async function handleOnUpdate(updatedItems: string[]) {
    const res = await updateCourseLessonsOrder({
      idsInOrder: updatedItems as CourseLessonId[],
    });
    if (res) {
      toast({
        title: "Success!",
        description: "Updated course lesson order.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description:
          "Something went wrong trying to update course lesson order.",
      });
    }
  }

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  if (isLoading || !courseLessons || !sortableListItems) {
    return null;
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between pb-4">
        <Text className="font-bold">Course Lessons</Text>
        <DropdownMenu open={menuIsOpen} onOpenChange={setMenuIsOpen}>
          <DropdownMenuTrigger>
            <MoreVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <QuickEditCourseLessonForm
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
            {courseLessons.map((courseLesson) => (
              <SortableListItem key={courseLesson._id} id={courseLesson._id}>
                <div className="w-full flex flex-col truncate">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      router.push(
                        `/admin/courses/${courseId}/lessons/${courseLesson.lessonId}/sections`
                      )
                    }
                    className={cn(
                      "w-full truncate transition-all",
                      selectedLessonId === courseLesson.lessonId &&
                        "font-bold pl-5"
                    )}
                  >
                    <div className="w-full text-left truncate">
                      {courseLesson.lesson.title}
                    </div>
                  </Button>
                  {selectedLessonId === courseLesson.lessonId && (
                    <div className="pt-2">
                      <LessonSectionsNav
                        lessonId={selectedLessonId}
                        sectionId={selectedSectionId}
                        hideHeader
                        rootUrl={`/admin/courses/${courseId}/lessons`}
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
          onValueChange={(lessonId) =>
            router.push(`/admin/courses/${courseId}/lessons/${lessonId}`)
          }
          value={selectedLessonId as string}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a lesson" />
          </SelectTrigger>
          <SelectContent>
            {courseLessons.map((courseLesson) => (
              <SelectItem
                value={courseLesson.lessonId}
                key={courseLesson.lessonId}
              >
                {courseLesson.lesson.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
