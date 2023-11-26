import { Button } from "@/lib/ui";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

interface CreateModuleSectionButtonProps {
  moduleId: Id<"modules">;
}

export function CreateModuleSectionButton({
  moduleId,
}: CreateModuleSectionButtonProps) {
  const createModuleSection = useMutation(api.moduleSections.create);

  const handleCreateNewSection = () => {
    createModuleSection({
      moduleId,
      type: "text",
    });
  };

  return (
    <Button
      variant="ghost"
      className="w-full text-left"
      onClick={handleCreateNewSection}
    >
      <div className="w-full text-left italic">+ New Section</div>
    </Button>
  );
}
