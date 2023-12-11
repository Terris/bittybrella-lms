import { ReactNode } from "react";
import { Breadcrumb, Breadcrumbs } from "../ui";

interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
}

export function PageHeader({ breadcrumbs }: PageHeaderProps) {
  return (
    <div className="w-full flex flex-row items-center justify-between h-14 px-8"></div>
  );
}
