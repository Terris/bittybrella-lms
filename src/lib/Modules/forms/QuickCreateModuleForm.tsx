"use client";

import * as Yup from "yup";
import { useToast } from "@/lib/hooks/useToast";
import {
  AdminFormConfig,
  AdminDialogForm,
  type AdminFieldtype,
} from "@/lib/Admin";
import type { ModuleFormFields } from "../types";
import { useCreateModule } from "../hooks/useCreateModule";

const validationSchema = Yup.object().shape({
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
  {
    name: "isPublished",
    label: "Published?",
    fieldtype: "switch" as AdminFieldtype,
    initialValue: false,
  },
];

const initialValues = {
  title: "",
  description: "",
  isPublished: false,
};

export const QuickCreateModuleForm = () => {
  const { toast } = useToast();
  const { createModule } = useCreateModule();

  async function onSubmit(values: ModuleFormFields) {
    const result = await createModule(values);

    if (result) {
      toast({
        title: "Success!",
        description: "Saved new module.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Error saving module. Please try again.",
      });
    }
  }

  const config: AdminFormConfig<ModuleFormFields> = {
    validationSchema,
    fields,
    initialValues,
    onSubmit,
  };

  return (
    <AdminDialogForm<ModuleFormFields>
      config={config}
      formTitle="Create new module"
    />
  );
};
