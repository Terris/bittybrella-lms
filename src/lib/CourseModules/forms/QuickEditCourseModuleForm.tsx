"use client";

import * as Yup from "yup";
import { useToast } from "@/lib/hooks/useToast";
import {
  AdminDialogForm,
  AdminFormConfig,
  Button,
  type AdminFieldtype,
} from "@/lib/ui";
import { useAllModules } from "@/lib/Modules";
import { type CourseId } from "@/lib/Courses";
import { useCourseModules, useUpdateCourseModules } from "../hooks";
import type { CourseModuleFormFields } from "../types";

const validationSchema = Yup.object().shape({
  moduleIds: Yup.array().of(Yup.string()),
});

export const QuickEditCourseModuleForm = ({
  courseId,
  onCloseForm,
}: {
  courseId: CourseId;
  onCloseForm?: () => void;
}) => {
  const { toast } = useToast();
  const { modules } = useAllModules();
  const { courseModules } = useCourseModules({ courseId });
  const { updateCourseModules } = useUpdateCourseModules();

  const fields = [
    {
      name: "moduleIds",
      label: "Modules",
      fieldtype: "multiselect" as AdminFieldtype,
      options: modules?.map((module) => ({
        label: module?.title,
        value: module?._id,
      })),
    },
  ];

  const initialValues = {
    moduleIds: (courseModules ?? []).map((cm) => cm?.moduleId),
  };

  async function onSubmit(values: CourseModuleFormFields) {
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

  const config: AdminFormConfig<CourseModuleFormFields> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  // TODO: Handle loading and error state
  if (!modules || !courseModules) return null;

  return (
    <AdminDialogForm<CourseModuleFormFields>
      config={config}
      formTitle="Edit Course Modules"
      renderTrigger={
        <Button variant="ghost" size="sm">
          Edit course modules
        </Button>
      }
      onCloseForm={() => onCloseForm?.()}
    />
  );
};
