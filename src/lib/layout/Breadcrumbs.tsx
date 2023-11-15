import Link from "next/link";
import { TextLink } from "../ui";

export interface Breadcrumb {
  href: string;
  label: string;
}

export interface BreadcrumbsProps {
  breadcrumbs?: Breadcrumb[];
}
export const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps) => {
  return (
    <p className="text-xs flex gap-4">
      <TextLink
        href="/"
        className={breadcrumbs?.length === 0 ? "font-bold" : ""}
      >
        Home
      </TextLink>{" "}
      {breadcrumbs?.length && "/"}{" "}
      {breadcrumbs?.map((bc, index) => (
        <>
          <Link
            href={bc.href}
            className={index + 1 === breadcrumbs.length ? "font-bold" : ""}
          >
            {bc.label}
          </Link>
          {index + 1 < breadcrumbs.length && " / "}
        </>
      ))}
    </p>
  );
};
