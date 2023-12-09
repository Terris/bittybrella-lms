import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useCreateModule() {
  const createModule = useMutation(api.modules.create);
  return { createModule };
}
