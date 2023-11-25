import { Button } from "@/lib/ui";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface CreateModuleSectionFormProps {
  moduleId: Id<"modules">;
}

export function CreateModuleSectionForm({
  moduleId,
}: CreateModuleSectionFormProps) {
  const createModuleSection = useMutation(api.moduleSections.create);

  const handleCreateNewSection = () => {
    createModuleSection({
      moduleId,
      type: "text",
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={handleCreateNewSection}
    >
      New Section
    </Button>
  );
}
