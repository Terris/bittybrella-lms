import { Button } from "@/lib/ui";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { PlusSquare } from "lucide-react";

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
      size="sm"
      className="w-full text-left mb-4"
      onClick={handleCreateNewSection}
    >
      <div className="w-full text-left flex items-center gap-2">
        <PlusSquare className="w-4 h-4" /> New Section
      </div>
    </Button>
  );
}
