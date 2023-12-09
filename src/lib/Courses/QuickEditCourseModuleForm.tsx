"use client";

import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AdminDialogForm, AdminFormConfig, AdminFieldtype } from "@/lib/Admin";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/lib/ui";

// Define the fields
export interface CourseModule {
  moduleIds: Id<"modules">[];
}

// Define the validation schema
const FormSchema = Yup.object().shape({
  moduleIds: Yup.array().of(Yup.string()),
});

export const QuickEditCourseModuleForm = ({
  courseId,
  onCloseForm,
}: {
  courseId: Id<"courses">;
  onCloseForm?: () => void;
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
        description: "Updated course modules.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Error saving course modules. Please try again.",
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

  return (
    <AdminDialogForm<CourseModule>
      config={config}
      formTitle="Edit Course Modules"
      renderTrigger={
        <Button variant="ghost" size="sm">
          Edit course modules
        </Button>
      }
      onCloseForm={onCloseForm}
    />
  );
};
