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
      type: "article",
    });
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCreateNewSection}>
      <PlusSquare className="w-4 h-4" />
    </Button>
  );
}
