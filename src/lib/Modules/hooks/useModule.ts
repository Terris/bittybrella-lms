import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { skipOrBuildArgs } from "@/lib/utils";

export function useModule({ id }: { id: Id<"modules"> }) {
  const moduleData = useQuery(
    api.modules.findById,
    skipOrBuildArgs([!id], { id })
  );
  const isLoading = !moduleData;
  const error = !isLoading && !moduleData ? "Error loading module" : null;
  return { moduleData, isLoading, error };
}
