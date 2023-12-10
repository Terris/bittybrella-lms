"use client";

import * as Yup from "yup";
import { Settings } from "lucide-react";
import { useToast } from "@/lib/hooks/useToast";
import {
  AdminFieldtype,
  AdminFormConfig,
  AdminDialogForm,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/ui";
import type { CourseFormFields, CourseId } from "../types";
import { useCourse, useUpdateCourse } from "../hooks";

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
  { name: "title", label: "Title" },
  { name: "description", label: "Description" },
  {
    name: "isPublished",
    label: "Published?",
    fieldtype: "switch" as AdminFieldtype,
  },
];

interface EditCourseFormProps {
  courseId: CourseId;
}

export const QuickEditCourseForm = ({ courseId }: EditCourseFormProps) => {
  const { toast } = useToast();
  const { course } = useCourse({ id: courseId });
  const { updateCourse } = useUpdateCourse();

  const initialValues = {
    title: course?.title ?? "",
    description: course?.description ?? "",
    isPublished: course?.isPublished ?? false,
  };

  async function onSubmit(values: CourseFormFields) {
    if (!course) return;
    const result = await updateCourse({ id: courseId, ...values });

    if (result) {
      toast({
        title: "Success!",
        description: "Course saved.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to edit course.",
      });
    }
  }

  const courseFormConfig: AdminFormConfig<CourseFormFields> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminDialogForm<CourseFormFields>
      config={courseFormConfig}
      formTitle="Edit course"
      renderTrigger={
        <Button variant="ghost" size="sm">
          <Tooltip>
            <TooltipTrigger>
              <Settings className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Edit course settings</TooltipContent>
          </Tooltip>
        </Button>
      }
    />
  );
};
