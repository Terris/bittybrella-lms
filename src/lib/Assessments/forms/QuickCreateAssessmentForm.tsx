"use client";

import * as Yup from "yup";
import { AdminQuickForm, AdminFormConfig } from "../../Admin/AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";
import { type AssessmentFormFields } from "../types";
import { useCreateAssessment } from "../hooks/useCreateAssessment";

const FormSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
});

const fields = [
  { name: "title", label: "Title", initialValue: "" },
  { name: "description", label: "Description", initialValue: "" },
];

export const QuickCreateAssessmentForm = () => {
  const { toast } = useToast();
  const { createAssessment } = useCreateAssessment();

  async function onSubmit(values: AssessmentFormFields) {
    const result = await createAssessment(values);

    if (result) {
      toast({
        title: "Success!",
        description: "Saved new assessment.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to create a new assessment.",
      });
    }
  }

  // Set initial values
  const initialValues = {
    title: "",
    description: "",
  };

  const formConfig: AdminFormConfig<AssessmentFormFields> = {
    validationSchema: FormSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminQuickForm<AssessmentFormFields>
      config={formConfig}
      formTitle={"Create new assessment"}
    />
  );
};
