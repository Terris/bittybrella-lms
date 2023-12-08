"use client";

import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  AdminQuickForm,
  AdminFormConfig,
} from "../../app/admin/AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";
import { Id } from "../../../convex/_generated/dataModel";
import { Pencil } from "lucide-react";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui";

// Define the fields that can be edited
export interface Assessment {
  title: string;
  description: string;
}

// Define the validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
});

// Set toast messages for success and error
const successMessage = "Assessment saved.";
const errorMessage = "Something went wrong trying to update assessment.";

// Set the form title
const formTitle = "Edit assessment";

interface EditAssessmentFormProps {
  assessmentId: Id<"assessments">;
}

export const QuickEditAssessmentForm = ({
  assessmentId,
}: EditAssessmentFormProps) => {
  // Fetch the assessment to edit
  const assessment = useQuery(api.assessments.findById, { id: assessmentId });

  // Define the mutation
  const editAssessment = useMutation(api.assessments.update);

  const { toast } = useToast();

  // Configure the fields for diplay
  const fields = [
    { name: "title", label: "Title", initialValue: "" },
    { name: "description", label: "Description", initialValue: "" },
  ];

  async function onSubmit(values: Assessment) {
    if (!assessment) return;
    const result = await editAssessment({ id: assessmentId, ...values });

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
    title: assessment?.title ?? "",
    description: assessment?.description ?? "",
  };

  const formConfig: AdminFormConfig<Assessment> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminQuickForm<Assessment>
      config={formConfig}
      formTitle={formTitle}
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
