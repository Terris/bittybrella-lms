"use client";

import * as Yup from "yup";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  AdminFieldtype,
  AdminQuickForm,
  AdminFormConfig,
} from "../AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";

// Define the fields
export interface Course {
  title: string;
  description: string;
  isPublished: boolean;
}

// Define the validation schema
const FormSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
  isPublished: Yup.boolean().optional(),
});

// Configure the fields for diplay
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

// Set toast messages for success and error
const successMessage = "Saved new course.";
const errorMessage = "Something went wrong trying to create a new course.";

// Set the form title
const formTitle = "Create new course";

export const QuickCreateCourseForm = () => {
  // Define the mutation
  const createCourse = useMutation(api.courses.create);

  const { toast } = useToast();

  async function onSubmit(values: Course) {
    const result = await createCourse(values);

    if (result) {
      toast({
        title: "Success!",
        description: successMessage,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: errorMessage,
      });
    }
  }

  // Set initial values
  const initialValues = {
    title: "",
    description: "",
    isPublished: false,
  };

  const config: AdminFormConfig<Course> = {
    validationSchema: FormSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return <AdminQuickForm<Course> config={config} formTitle={formTitle} />;
};
