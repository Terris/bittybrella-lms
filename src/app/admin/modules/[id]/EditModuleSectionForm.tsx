import { Badge, ContentEditor, Input, Label, Text } from "@/lib/ui";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import { use, useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useToast } from "@/lib/hooks/useToast";
import { Loader } from "@/lib/ui/Loader";

interface ModuleSectionProps {
  id: Id<"moduleSections">;
}

export function EditModuleSectionForm({ id }: ModuleSectionProps) {
  const moduleSectionData = useQuery(api.moduleSections.get, {
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
  const [newSectionContent, setNewSectionContent] = useState<
    string | undefined
  >(section.content);
  const debouncedNewSectionContent = useDebounce(newSectionContent, 1000);
  const [status, setStatus] = useState<"SAVING" | "SAVED">("SAVED");

  useEffect(() => {
    if (
      newSectionTitle !== debouncedNewSectionTitle ||
      newSectionContent !== debouncedNewSectionContent
    ) {
      setStatus("SAVING");
    } else {
      setStatus("SAVED");
    }
  }, [
    debouncedNewSectionContent,
    debouncedNewSectionTitle,
    newSectionContent,
    newSectionTitle,
    status,
  ]);

  // Update the db title when the debounced title value changes
  useEffect(() => {
    if (section.title === debouncedNewSectionTitle) {
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

  // Update the db content when the debounced content value changes
  useEffect(() => {
    if (section.content === debouncedNewSectionContent) return;
    try {
      updateModuleSection({
        id: section._id,
        content: debouncedNewSectionContent,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNewSectionContent]);

  return (
    <>
      <div className="flex mb-4">
        <Input
          name="section-title"
          placeholder="Section title"
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
        />
      </div>
      <ContentEditor
        initialContent={section.content}
        onChange={(content: string) => setNewSectionContent(content)}
      />
      <div className="text-right py-4">
        <Badge className="ml-4">
          {status === "SAVING" && <Loader className="w-2 h-2 mr-2" />}
          {status}
        </Badge>
      </div>
    </>
  );
};
