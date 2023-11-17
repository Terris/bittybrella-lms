"use client";

import * as Yup from "yup";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AdminFieldtype, AdminForm, AdminFormConfig } from "../AdminForm";
import { useToast } from "@/lib/hooks/use-toast";

export interface Course {
  title: string;
  description: string;
  isPublished: boolean;
}

const courseFormFields = [
  { name: "title", label: "Title", initialValue: "" },
  { name: "description", label: "Description", initialValue: "" },
  {
    name: "isPublished",
    label: "Published?",
    type: "switch" as AdminFieldtype,
    initialValue: false,
  },
];

const courseFormInitialValues = {
  title: "",
  description: "",
  isPublished: false,
};

const CourseFormSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
  isPublished: Yup.boolean().optional(),
});

export const CreateCourseForm = () => {
  const createCourse = useMutation(api.courses.create);
  const { toast } = useToast();

  async function onSubmit(values: Course) {
    const result = await createCourse(values);
    if (result) {
      toast({
        title: "Success!",
        description: "Created new course.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to create a new course.",
      });
    }
  }

  const courseFormConfig: AdminFormConfig<Course> = {
    schema: CourseFormSchema,
    initialValues: courseFormInitialValues,
    fields: courseFormFields,
    onSubmit,
  };

  return (
    <AdminForm<Course>
      config={courseFormConfig}
      formTitle={"Create new course"}
      triggerLabel={"Create course"}
    />
  );
};
