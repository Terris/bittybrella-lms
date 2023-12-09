"use client";

import * as Yup from "yup";
import { Pencil } from "lucide-react";
import { useToast } from "@/lib/hooks";
import {
  AdminFormConfig,
  AdminDialogForm,
  type AdminFieldtype,
} from "@/lib/Admin";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui";
import { useModule, useUpdateModule } from "../hooks";
import type { ModuleFormFields, ModuleId } from "../types";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
  isPublished: Yup.boolean().optional(),
});

const fields = [
  { name: "title", label: "Title", initialValue: "" },
  { name: "description", label: "Description", initialValue: "" },
  {
    name: "isPublished",
    label: "Published",
    initialValue: false,
    fieldtype: "switch" as AdminFieldtype,
  },
];

// Set the form title
const formTitle = "Edit module";

interface QuickEditModuleFormProps {
  moduleId: ModuleId;
}

export const QuickEditModuleForm = ({ moduleId }: QuickEditModuleFormProps) => {
  const { toast } = useToast();
  const { moduleData: existingModule } = useModule({ id: moduleId });
  const { updateModule } = useUpdateModule();

  async function onSubmit(values: ModuleFormFields) {
    if (!existingModule) return;
    const result = await updateModule({ id: moduleId, ...values });

    if (result) {
      toast({
        title: "Success!",
        description: "Module saved.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Error saving module. Please try again.",
      });
    }
  }

  // Set initial values
  const initialValues = {
    title: existingModule?.title ?? "",
    description: existingModule?.description ?? "",
    isPublished: existingModule?.isPublished ?? false,
  };

  const moduleFormConfig: AdminFormConfig<ModuleFormFields> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminDialogForm<ModuleFormFields>
      config={moduleFormConfig}
      formTitle={formTitle}
      renderTrigger={
        <Button variant="ghost" size="sm">
          <Tooltip>
            <TooltipTrigger>
              <Pencil className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Edit module settings</TooltipContent>
          </Tooltip>
        </Button>
      }
    />
  );
};
