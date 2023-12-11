import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ModuleId } from "@/lib/Modules";
import { useModuleSections } from "./useModuleSections";

// We always want to optimistically update order changes
export function useUpdateModuleSectionsOrder({
  moduleId,
}: {
  moduleId?: ModuleId;
}) {
  const { moduleSections } = useModuleSections({ moduleId });

  const updateModuleSectionsOrder = useMutation(
    api.moduleSections.updateOrder
  ).withOptimisticUpdate((localStore, args) => {
    if (!moduleId || !moduleSections) return;
    const { idsInOrder } = args;
    const updatedModuleSections = moduleSections
      .map((section) => ({
        ...section,
        order: idsInOrder.indexOf(section._id) + 1,
      }))
      .sort((a, b) => a.order - b.order);
    const currentValue = localStore.getQuery(
      api.moduleSections.findByModuleId,
      {
        moduleId,
      }
    );
    if (currentValue !== undefined) {
      localStore.setQuery(
        api.moduleSections.findByModuleId,
        {
          moduleId,
        },
        [...updatedModuleSections]
      );
    }
  });
  return { updateModuleSectionsOrder };
}
