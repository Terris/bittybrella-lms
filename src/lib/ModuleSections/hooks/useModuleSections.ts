import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ModuleId } from "@/lib/Modules";
import { skipOrBuildArgs } from "@/lib/utils";

export function useModuleSections({ moduleId }: { moduleId?: ModuleId }) {
  const moduleSections = useQuery(
    api.moduleSections.findByModuleId,
    skipOrBuildArgs([!moduleId], { moduleId })
  );
  const isLoading = !moduleSections;
  const error =
    !isLoading && !moduleSections
      ? "Error getting assessment questions."
      : null;
  return { isLoading, error, moduleSections };
}
