"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { MoreVertical } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  Input,
} from "@/lib/ui";
import type { LessonSectionDoc, LessonSectionId } from "../types";
import { useDeleteLessonSection, useLessonSection } from "../hooks";

interface LessonSectionProps {
  id: LessonSectionId;
}

export function EditLessonSectionForm({ id }: LessonSectionProps) {
  const { isLoading, error, lessonSection } = useLessonSection({
    id,
  });

  if (!lessonSection) return null;
  return <Form section={lessonSection} />;
}

const Form = ({ section }: { section: LessonSectionDoc }) => {
  const { toast } = useToast();
  const updateLessonSection = useMutation(api.lessonSections.update);
  const [newSectionTitle, setNewSectionTitle] = useState<string>(section.title);
  const debouncedNewSectionTitle = useDebounce(newSectionTitle, 1000);
  const titleHasChanges = section.title !== debouncedNewSectionTitle;

  // Update the db title when the debounced title value changes
  useEffect(() => {
    if (!titleHasChanges) {
      return;
    }
    try {
      updateLessonSection({
        id: section._id,
        title: debouncedNewSectionTitle,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNewSectionTitle]);

  const handleSaveContent = useCallback(
    (content: string) => {
      if (!section._id) return;
      try {
        updateLessonSection({
          id: section._id,
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
    [section._id, toast, updateLessonSection]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row">
          <Input
            variant="contentBlockEditor"
            name="section-title"
            placeholder="Section title"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
          <LessonSectionSettingsMenu lessonSectionId={section._id} />
        </div>
      </div>
      <ContentEditor
        initialContent={section.content}
        onChange={handleSaveContent}
      />
    </div>
  );
};

function LessonSectionSettingsMenu({
  lessonSectionId,
}: {
  lessonSectionId: LessonSectionId;
}) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const { deleteLessonSection } = useDeleteLessonSection();

  return (
    <DropdownMenu open={menuIsOpen} onOpenChange={(o) => setMenuIsOpen(o)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <AlertDialog onOpenChange={(open) => setMenuIsOpen(open)}>
              <AlertDialogTrigger>Delete section</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this section.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        deleteLessonSection({ id: lessonSectionId })
                      }
                    >
                      Yes, I&lsquo;m sure.
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
