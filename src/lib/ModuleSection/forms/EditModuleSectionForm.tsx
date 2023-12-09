import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
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
  FlexRow,
  Input,
  Label,
} from "@/lib/ui";
import { MoreVertical } from "lucide-react";

interface ModuleSectionProps {
  id: Id<"moduleSections">;
}

export function EditModuleSectionForm({ id }: ModuleSectionProps) {
  const moduleSectionData = useQuery(api.moduleSections.findById, {
    id,
  });

  if (!moduleSectionData) return null;
  return <Form section={moduleSectionData} />;
}

const Form = ({ section }: { section: Doc<"moduleSections"> }) => {
  const { toast } = useToast();
  const updateModuleSection = useMutation(api.moduleSections.update);
  const [newSectionTitle, setNewSectionTitle] = useState<string>(section.title);
  const debouncedNewSectionTitle = useDebounce(newSectionTitle, 1000);
  const titleHasChanges = section.title !== debouncedNewSectionTitle;

  // Update the db title when the debounced title value changes
  useEffect(() => {
    if (!titleHasChanges) {
      return;
    }
    try {
      updateModuleSection({
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
        updateModuleSection({
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
    [section._id, toast, updateModuleSection]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FlexRow>
          <Input
            name="section-title"
            placeholder="Section title"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
          />
          <ModuleSectionSettingsMenu moduleSectionId={section._id} />
        </FlexRow>
      </div>
      <div>
        <ContentEditor
          initialContent={section.content}
          onChange={handleSaveContent}
        />
      </div>
    </div>
  );
};

function ModuleSectionSettingsMenu({
  moduleSectionId,
}: {
  moduleSectionId: Id<"moduleSections">;
}) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const deleteModuleSection = useMutation(api.moduleSections.deleteById);

  return (
    <DropdownMenu open={menuIsOpen} onOpenChange={(o) => setMenuIsOpen(o)}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="ml-2">
          <MoreVertical className="w-4 h-4" />
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
                    This action cannot be undone. This will permanently delete
                    this section.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        deleteModuleSection({ id: moduleSectionId })
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
