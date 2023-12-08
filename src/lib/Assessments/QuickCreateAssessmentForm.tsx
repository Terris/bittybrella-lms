"use client";

import * as Yup from "yup";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  AdminQuickForm,
  AdminFormConfig,
} from "../../app/admin/AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";

// Define the fields
export interface Assessment {
  title: string;
  description: string;
}

// Define the validation schema
const FormSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
});

// Configure the fields for diplay
const fields = [
  { name: "title", label: "Title", initialValue: "" },
  { name: "description", label: "Description", initialValue: "" },
];

// Set toast messages for success and error
const successMessage = "Saved new assessment.";
const errorMessage = "Something went wrong trying to create a new assessment.";

// Set the form title
const formTitle = "Create new assessment";

export const QuickCreateAssessmentForm = () => {
  // Define the mutation
  const createAssessment = useMutation(api.assessments.create);

  const { toast } = useToast();

  async function onSubmit(values: Assessment) {
    const result = await createAssessment(values);

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
  };

  const formConfig: AdminFormConfig<Assessment> = {
    validationSchema: FormSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminQuickForm<Assessment> config={formConfig} formTitle={formTitle} />
  );
};
