"use client";

import * as Yup from "yup";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AdminQuickForm, AdminFormConfig } from "../AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";

// Define the fields
export interface Article {
  title: string;
}

// Define the validation schema
const formSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
});

// Configure the fields for diplay
const fields = [{ name: "title", label: "Title" }];

// Set toast messages for success and error
const successMessage = "Saved new module.";
const errorMessage = "Error saving module. Please try again.";

// Set the form title
const formTitle = "Create new article";

export const CreateArticleForm = () => {
  // Define the mutation
  const createArticle = useMutation(api.articles.create);

  const { toast } = useToast();

  async function onSubmit(values: Article) {
    const result = await createArticle(values);

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
  };

  const formConfig: AdminFormConfig<Article> = {
    validationSchema: formSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return <AdminQuickForm<Article> config={formConfig} formTitle={formTitle} />;
};
