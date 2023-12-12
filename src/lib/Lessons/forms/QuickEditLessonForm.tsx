"use client";

import * as Yup from "yup";
import { Settings } from "lucide-react";
import { useToast } from "@/lib/hooks";
import {
  AdminFormConfig,
  AdminDialogForm,
  type AdminFieldtype,
} from "@/lib/Admin";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui";
import { useLesson, useUpdateLesson } from "../hooks";
import type { LessonFormFields, LessonId } from "../types";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
  isPublished: Yup.boolean().optional(),
});

const fields = [
  { name: "title", label: "Title", initialValue: "" },
  { name: "description", label: "Description", initialValue: "" },
  {
    name: "isPublished",
    label: "Published",
    initialValue: false,
    fieldtype: "switch" as AdminFieldtype,
  },
];

export const QuickEditLessonForm = ({ lessonId }: { lessonId: LessonId }) => {
  const { toast } = useToast();
  const { lesson } = useLesson({ id: lessonId });
  const { updateLesson } = useUpdateLesson();

  async function onSubmit(values: LessonFormFields) {
    if (!lesson) return;
    const result = await updateLesson({ id: lessonId, ...values });

    if (result) {
      toast({
        title: "Success!",
        description: "Lesson saved.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Error saving lesson. Please try again.",
      });
    }
  }

  // Set initial values
  const initialValues = {
    title: lesson?.title ?? "",
    description: lesson?.description ?? "",
    isPublished: lesson?.isPublished ?? false,
  };

  const lessonFormConfig: AdminFormConfig<LessonFormFields> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminDialogForm<LessonFormFields>
      config={lessonFormConfig}
      formTitle="Edit lesson"
      renderTrigger={
        <Button variant="ghost" size="sm">
          <Tooltip>
            <TooltipTrigger>
              <Settings className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Edit lesson settings</TooltipContent>
          </Tooltip>
        </Button>
      }
    />
  );
};
