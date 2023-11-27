"use client";

import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  AdminFieldtype,
  AdminForm,
  AdminFormConfig,
  AdminFormField,
  AdminFormFieldOption,
} from "../AdminForm";
import { useToast } from "@/lib/hooks/useToast";
import { Id } from "../../../../convex/_generated/dataModel";
import { Pencil } from "lucide-react";
import { Button } from "@/lib/ui";

// Define the fields that can be edited
export interface Course {
  title: string;
  description: string;
  isPublished: boolean;
  moduleIds: Id<"modules">[];
}

// Define the validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
  isPublished: Yup.boolean().optional(),
  moduleIds: Yup.array().of(Yup.string()),
});

// Set toast messages for success and error
const successMessage = "Course saved.";
const errorMessage = "Something went wrong trying to edit course.";

// Set the form title
const formTitle = "Edit course";

interface EditCourseFormProps {
  courseId: Id<"courses">;
}

export const EditCourseForm = ({ courseId }: EditCourseFormProps) => {
  // Fetch the course to edit
  const course = useQuery(api.courses.getWithModules, { id: courseId });
  // Fetch all modules for course module options
  const modules = useQuery(api.modules.getAll);

  // Define the mutation
  const editCourse = useMutation(api.courses.update);

  const { toast } = useToast();

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
    {
      name: "moduleIds",
      label: "Modules",
      fieldtype: "multiselect" as AdminFieldtype,
      initialValue: course?.moduleIds,
      options: modules?.map((module) => ({
        label: module.title,
        value: module._id,
      })),
    },
  ];

  async function onSubmit(values: Course) {
    if (!course) return;
    const result = await editCourse({ id: courseId, ...values });

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
    title: course?.title ?? "",
    description: course?.description ?? "",
    isPublished: course?.isPublished ?? false,
    moduleIds: course?.moduleIds ?? [],
  };

  const courseFormConfig: AdminFormConfig<Course> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminForm<Course>
      config={courseFormConfig}
      formTitle={formTitle}
      renderTrigger={
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      }
    />
  );
};
