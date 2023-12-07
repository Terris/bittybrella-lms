"use client";

import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  AdminFieldtype,
  AdminQuickForm,
  AdminFormConfig,
} from "../AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";
import { Id } from "../../../../convex/_generated/dataModel";
import { Pencil } from "lucide-react";
import { Button } from "@/lib/ui";

// Define the fields that can be edited
export interface Course {
  title: string;
  description: string;
  isPublished: boolean;
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
});

// Set toast messages for success and error
const successMessage = "Course saved.";
const errorMessage = "Something went wrong trying to edit course.";

// Set the form title
const formTitle = "Edit course";

interface EditCourseFormProps {
  courseId: Id<"courses">;
}

export const QuickEditCourseForm = ({ courseId }: EditCourseFormProps) => {
  // Fetch the course to edit
  const course = useQuery(api.courses.findById, { id: courseId });

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
  };

  const courseFormConfig: AdminFormConfig<Course> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminQuickForm<Course>
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
