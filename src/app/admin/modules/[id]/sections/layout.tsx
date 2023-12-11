"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ModuleId, ModuleSectionsNav } from "@/lib/Modules";
import { useModuleSections } from "@/lib/ModuleSections";

interface AdminModuleSectionLayoutProps {
  children: React.ReactNode;
}

export default function AdminModuleSectionLayout({
  children,
}: AdminModuleSectionLayoutProps) {
  const router = useRouter();
  const { id, sectionId } = useParams();
  const { moduleSections } = useModuleSections({
    moduleId: id as ModuleId,
  });

  useEffect(() => {
    if (!moduleSections || !moduleSections.length) return;
    if (!sectionId) {
      router.replace(`/admin/modules/${id}/sections/${moduleSections[0]._id}`);
    }
  });

  if (!id) return null;

  return (
    <div className="w-full py-8 lg:flex lg:flex-row lg:h-full lg:gap-4">
      <aside className="px-4 lg:w-1/5 lg:pl-8">
        <div className="sticky top-2">
          <ModuleSectionsNav moduleId={id as ModuleId} />
        </div>
      </aside>
      <div className="px-4 lg:w-4/5 lg:pr-8">
        <div className="flex flex-col gap-4 max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
