"use client";

import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  AdminQuickForm,
  AdminFormConfig,
  AdminFieldtype,
} from "../Admin/AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";
import { Id } from "../../../convex/_generated/dataModel";
import { Pencil } from "lucide-react";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui";

// Define the fields that can be edited
export interface Module {
  title: string;
  description: string;
  isPublished: boolean;
}

// Define the validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(50, "Description must be less than 50 characters")
    .required("Description is required"),
  isPublished: Yup.boolean().optional(),
});

// Configure the fields for diplay
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

// Set toast messages for success and error
const successMessage = "Module saved.";
const errorMessage = "Error saving module. Please try again.";

// Set the form title
const formTitle = "Edit module";

interface QuickEditModuleFormProps {
  moduleId: Id<"modules">;
}

export const QuickEditModuleForm = ({ moduleId }: QuickEditModuleFormProps) => {
  // Fetch the module to edit
  const existingModule = useQuery(api.modules.findById, { id: moduleId });

  // Define the mutation
  const editModule = useMutation(api.modules.update);

  const { toast } = useToast();

  async function onSubmit(values: Module) {
    if (!existingModule) return;
    const result = await editModule({ id: moduleId, ...values });

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
    title: existingModule?.title ?? "",
    description: existingModule?.description ?? "",
    isPublished: existingModule?.isPublished ?? false,
  };

  const moduleFormConfig: AdminFormConfig<Module> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminQuickForm<Module>
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
