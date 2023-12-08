"use client";

import * as Yup from "yup";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  AdminQuickForm,
  AdminFormConfig,
  AdminFieldtype,
} from "../../app/admin/AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";

// Define the fields
export interface Module {
  title: string;
  description: string;
  isPublished: boolean;
}

// Define the validation schema
const ModuleFormSchema = Yup.object().shape({
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
  {
    name: "isPublished",
    label: "Published?",
    fieldtype: "switch" as AdminFieldtype,
    initialValue: false,
  },
];

// Set toast messages for success and error
const successMessage = "Saved new module.";
const errorMessage = "Error saving module. Please try again.";

// Set the form title
const formTitle = "Create new module";

export const CreateModuleForm = () => {
  // Define the mutation
  const createModule = useMutation(api.modules.create);

  const { toast } = useToast();

  async function onSubmit(values: Module) {
    const result = await createModule(values);

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

  const config: AdminFormConfig<Module> = {
    validationSchema: ModuleFormSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return <AdminQuickForm<Module> config={config} formTitle={formTitle} />;
};
