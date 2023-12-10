import Link from "next/link";
import { TextLink } from ".";

export interface Breadcrumb {
  href: string;
  label: string;
}

export interface BreadcrumbsProps {
  breadcrumbs?: Breadcrumb[];
}
export const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps) => {
  return (
    <div className="text-sm flex gap-4">
      <TextLink
        href="/"
        className={breadcrumbs?.length === 0 ? "font-bold" : ""}
      >
        Home
      </TextLink>
      {breadcrumbs?.length && " / "}
      {breadcrumbs?.map((bc, index) => (
        <span key={bc.href} className="flex gap-4">
          <TextLink
            href={bc.href}
            className={index + 1 === breadcrumbs.length ? "font-bold" : ""}
          >
            {bc.label}
          </TextLink>
          {index + 1 < breadcrumbs.length && " / "}
        </span>
      ))}
    </div>
  );
};
