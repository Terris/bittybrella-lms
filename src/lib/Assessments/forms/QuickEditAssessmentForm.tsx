"use client";

import * as Yup from "yup";
import { Pencil } from "lucide-react";
import { useToast } from "@/lib/hooks";
import { AdminFormConfig, AdminDialogForm } from "@/lib/Admin";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui";
import { useAssessment, useUpdateAssessment } from "../hooks";
import type { AssessmentFormFields, AssessmentId } from "../types";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
});

const fields = [
  { name: "title", label: "Title" },
  { name: "description", label: "Description" },
];

export const QuickEditAssessmentForm = ({
  assessmentId,
}: {
  assessmentId: AssessmentId;
}) => {
  const { toast } = useToast();
  const { assessment } = useAssessment({ id: assessmentId });
  const { updateAssessment } = useUpdateAssessment();

  const initialValues = {
    title: assessment?.title ?? "",
    description: assessment?.description ?? "",
  };

  async function onSubmit(values: AssessmentFormFields) {
    if (!assessment) return;
    const result = await updateAssessment({ id: assessmentId, ...values });

    if (result) {
      toast({
        title: "Success!",
        description: "Assessment saved.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to update assessment.",
      });
    }
  }

  const formConfig: AdminFormConfig<AssessmentFormFields> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminDialogForm<AssessmentFormFields>
      config={formConfig}
      formTitle="Edit assessment"
      renderTrigger={
        <Button variant="ghost" size="sm">
          <Tooltip>
            <TooltipTrigger>
              <Pencil className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Edit assessment settings</TooltipContent>
          </Tooltip>
        </Button>
      }
    />
  );
};
