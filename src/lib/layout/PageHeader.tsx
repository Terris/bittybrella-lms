import { ReactNode } from "react";
import { Breadcrumb, Breadcrumbs } from "../ui";

interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  renderActions?: ReactNode;
}

export function PageHeader({ renderActions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="w-full flex flex-row items-center justify-between h-14 px-8">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div>{renderActions}</div>
    </div>
  );
}
