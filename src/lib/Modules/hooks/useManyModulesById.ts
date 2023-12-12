import { useQuery } from "convex/react";
import { type ModuleId } from "../types";
import { api } from "../../../../convex/_generated/api";
import { skipOrBuildArgs } from "@/lib/utils";

export function useManyModulesById({ ids }: { ids: ModuleId[] }) {
  const modules = useQuery(
    api.modules.findManyById,
    skipOrBuildArgs([!ids], { ids })
  );
  const isLoading = !modules;
  const error = !isLoading && !modules ? "Error loading modules" : undefined;
  return { isLoading, error, modules };
}
