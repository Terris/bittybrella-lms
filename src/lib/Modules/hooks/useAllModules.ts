import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useAllModules() {
  const modules = useQuery(api.modules.all);
  const isLoading = !modules;
  const error = !isLoading && !modules ? "Error loading modules" : null;
  return { modules, isLoading, error };
}
