import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateModule() {
  const updateModule = useMutation(api.modules.update);
  return { updateModule };
}
