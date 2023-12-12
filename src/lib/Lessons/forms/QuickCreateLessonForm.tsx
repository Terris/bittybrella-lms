"use client";

import * as Yup from "yup";
import { useToast } from "@/lib/hooks/useToast";
import {
  AdminFormConfig,
  AdminDialogForm,
  type AdminFieldtype,
} from "@/lib/Admin";
import type { LessonFormFields } from "../types";
import { useCreateLesson } from "../hooks/useCreateLesson";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
});

const fields = [
  { name: "title", label: "Title", initialValue: "" },
  { name: "description", label: "Description", initialValue: "" },
  {
    name: "isPublished",
    label: "Published?",
    fieldtype: "switch" as AdminFieldtype,
    initialValue: false,
  },
];

const initialValues = {
  title: "",
  description: "",
  isPublished: false,
};

export const QuickCreateLessonForm = () => {
  const { toast } = useToast();
  const { createLesson } = useCreateLesson();

  async function onSubmit(values: LessonFormFields) {
    const result = await createLesson(values);

    if (result) {
      toast({
        title: "Success!",
        description: "Saved new lesson.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Error saving lesson. Please try again.",
      });
    }
  }

  const config: AdminFormConfig<LessonFormFields> = {
    validationSchema,
    fields,
    initialValues,
    onSubmit,
  };

  return (
    <AdminDialogForm<LessonFormFields>
      config={config}
      formTitle="Create new lesson"
    />
  );
};
