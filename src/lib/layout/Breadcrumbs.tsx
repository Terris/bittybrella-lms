import Link from "next/link";

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
      <Link href="/" className={breadcrumbs?.length === 0 ? "font-bold" : ""}>
        Home
      </Link>
      {breadcrumbs?.length && " / "}
      {breadcrumbs?.map((bc, index) => (
        <span key={bc.href} className="flex gap-4">
          <Link
            href={bc.href}
            className={index + 1 === breadcrumbs.length ? "font-bold" : ""}
          >
            {bc.label}
          </Link>
          {index + 1 < breadcrumbs.length && " / "}
        </span>
      ))}
    </div>
  );
};
