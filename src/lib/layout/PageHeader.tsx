import { ReactNode } from "react";
import { Breadcrumb, Breadcrumbs } from "./Breadcrumbs";

interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  renderActions?: ReactNode;
}

export function PageHeader({ renderActions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between w-full h-16 py-2 border-b ">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div>{renderActions}</div>
    </div>
  );
}
