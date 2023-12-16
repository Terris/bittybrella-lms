"use client";

import * as Yup from "yup";
import { useToast } from "@/lib/hooks/useToast";
import {
  AdminDialogForm,
  AdminFormConfig,
  type AdminFieldtype,
} from "@/lib/Admin";
import { Button } from "@/lib/ui";
import { useFindAllLessons } from "@/lib/Lessons";
import { type CourseId } from "@/lib/Courses";
import { useCourseLessons, useUpdateCourseLessons } from "../hooks";
import type { CourseLessonFormFields } from "../types";

const validationSchema = Yup.object().shape({
  lessonIds: Yup.array().of(Yup.string()),
});

export const QuickEditCourseLessonForm = ({
  courseId,
  onCloseForm,
}: {
  courseId: CourseId;
  onCloseForm?: () => void;
}) => {
  const { toast } = useToast();
  const { lessons } = useFindAllLessons();
  const { courseLessons } = useCourseLessons({ courseId });
  const { updateCourseLessons } = useUpdateCourseLessons();

  const fields = [
    {
      name: "lessonIds",
      label: "Lessons",
      fieldtype: "multiselect" as AdminFieldtype,
      options: lessons?.map((lesson) => ({
        label: lesson?.title,
        value: lesson?._id,
      })),
    },
  ];

  const initialValues = {
    lessonIds: (courseLessons ?? []).map((cm) => cm?.lessonId),
  };

  async function onSubmit(values: CourseLessonFormFields) {
    const result = await updateCourseLessons({ courseId, ...values });

    if (result) {
      toast({
        title: "Success!",
        description: "Updated course lessons.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Error saving course lessons. Please try again.",
      });
    }
  }

  const config: AdminFormConfig<CourseLessonFormFields> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  // TODO: Handle loading and error state
  if (!lessons || !courseLessons) return null;

  return (
    <AdminDialogForm<CourseLessonFormFields>
      config={config}
      formTitle="Edit Course Lessons"
      renderTrigger={
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1.5 h-auto w-full justify-start"
        >
          Edit course lessons
        </Button>
      }
      onCloseForm={() => onCloseForm?.()}
    />
  );
};
