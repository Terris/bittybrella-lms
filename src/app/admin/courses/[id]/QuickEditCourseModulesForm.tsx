"use client";

import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  AdminQuickForm,
  AdminFormConfig,
  AdminFieldtype,
} from "../../AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";

// Define the fields
export interface CourseModule {
  moduleIds: Id<"modules">[];
}

// Define the validation schema
const FormSchema = Yup.object().shape({
  moduleIds: Yup.array().of(Yup.string()),
});

// Set toast messages for success and error
const successMessage = "Updated course modules.";
const errorMessage = "Error saving course modules. Please try again.";

// Set the form title
const formTitle = "Edit Course Modules";

export const QuickEditCourseModulesForm = ({
  courseId,
}: {
  courseId: Id<"courses">;
}) => {
  const allModules = useQuery(api.modules.all);
  const courseModules = useQuery(api.courseModules.findByCourseId, {
    courseId,
  });

  // Define the mutation
  const updateCourseModules = useMutation(
    api.courseModules.updateAllByCourseId
  );

  const { toast } = useToast();

  // Configure the fields for diplay
  const fields = [
    {
      name: "moduleIds",
      label: "Modules",
      fieldtype: "multiselect" as AdminFieldtype,
      options: allModules?.map((module) => ({
        label: module?.title,
        value: module?._id,
      })),
    },
  ];

  async function onSubmit(values: CourseModule) {
    const result = await updateCourseModules({ courseId, ...values });

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
    moduleIds: (courseModules ?? []).map((cm) => cm?.moduleId),
  };

  const config: AdminFormConfig<CourseModule> = {
    validationSchema: FormSchema,
    initialValues,
    fields,
    onSubmit,
  };

  if (!allModules || !courseModules) return null;

  return <AdminQuickForm<CourseModule> config={config} formTitle={formTitle} />;
};
