"use client";

import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AdminQuickForm, AdminFormConfig } from "../AdminQuickForm";
import { useToast } from "@/lib/hooks/useToast";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Pencil } from "lucide-react";
import { Button } from "@/lib/ui";

// Define the fields that can be edited
export interface Article {
  title: string;
}

// Define the validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(50, "Title must be less than 50 characters")
    .required("Title is required"),
});

// Configure the fields for diplay
const fields = [{ name: "title", label: "Title", initialValue: "" }];

// Set toast messages for success and error
const successMessage = "Article saved.";
const errorMessage = "Error saving article. Please try again.";

// Set the form title
const formTitle = "Edit article";

interface QuickEditArticleFormProps {
  articleId: Id<"articles">;
}

export const QuickEditArticleForm = ({
  articleId,
}: QuickEditArticleFormProps) => {
  // Fetch the article to edit
  const existingArticle = useQuery(api.articles.findById, { id: articleId });

  // Define the mutation
  const editArticle = useMutation(api.articles.update);

  const { toast } = useToast();

  async function onSubmit(values: Article) {
    if (!existingArticle) return;
    const result = await editArticle({ id: articleId, ...values });

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
    title: existingArticle?.title ?? "",
  };

  const formConfig: AdminFormConfig<Article> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <AdminQuickForm<Article>
      config={formConfig}
      formTitle={formTitle}
      renderTrigger={
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      }
    />
  );
};
