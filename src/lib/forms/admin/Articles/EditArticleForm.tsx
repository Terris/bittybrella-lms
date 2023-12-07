import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useToast } from "@/lib/hooks/useToast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  ContentEditor,
  Input,
  Label,
} from "@/lib/ui";

interface EditArticleFormProps {
  id: Id<"articles">;
}

export function EditArticleForm({ id }: EditArticleFormProps) {
  const articleData = useQuery(api.articles.findById, {
    id,
  });

  if (!articleData) return null;
  return <Form article={articleData} />;
}

const Form = ({ article }: { article: Doc<"articles"> }) => {
  const { toast } = useToast();
  const updateArticle = useMutation(api.articles.update);
  const [newArticleTitle, setNewArticleTitle] = useState<string>(article.title);
  const debouncedNewArticleTitle = useDebounce(newArticleTitle, 1000);
  const titleHasChanges = article.title !== debouncedNewArticleTitle;

  // Update the db title when the debounced title value changes
  useEffect(() => {
    if (!titleHasChanges) {
      return;
    }
    try {
      updateArticle({
        id: article._id,
        title: debouncedNewArticleTitle,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNewArticleTitle]);

  const handleSaveContent = useCallback(
    (content: string) => {
      if (!article._id) return;
      try {
        updateArticle({
          id: article._id,
          content: content,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    },
    [article._id, toast, updateArticle]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Input
          name="section-title"
          placeholder="Article title"
          value={newArticleTitle}
          onChange={(e) => setNewArticleTitle(e.target.value)}
        />
      </div>

      <ContentEditor
        initialContent={article.content}
        onChange={handleSaveContent}
      />

      <div className="flex justify-end">
        <DeleteArticleButton articleId={article._id} />
      </div>
    </div>
  );
};

export function DeleteArticleButton({
  articleId,
}: {
  articleId: Id<"articles">;
}) {
  const deleteArticle = useMutation(api.articles.deleteById);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete Article
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            article in all courses and modules that use it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={() => deleteArticle({ id: articleId })}
            >
              Yes, I&lsquo;m sure.
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
