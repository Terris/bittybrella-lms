"use client";

import * as Yup from "yup";
import { AdminFieldtype, AdminFormConfig, AdminDialogForm } from "@/lib/Admin";
import { useToast } from "@/lib/hooks";
import { useCreateCourse } from "../hooks";
import type { CourseFormFields } from "../types";

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
    label: "Published?",
    fieldtype: "switch" as AdminFieldtype,
    initialValue: false,
  },
];

export const QuickCreateCourseForm = () => {
  const { toast } = useToast();
  const { createCourse } = useCreateCourse();

  const initialValues = {
    title: "",
    description: "",
    isPublished: false,
  };

  async function onSubmit(values: CourseFormFields) {
    const result = await createCourse(values);

    if (result) {
      toast({
        title: "Success!",
        description: "Saved new course.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to create a new course.",
      });
    }
  }

  const config: AdminFormConfig<CourseFormFields> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminDialogForm<CourseFormFields>
      config={config}
      formTitle={"Create new course"}
    />
  );
};
