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
    <p className="text-xs flex gap-4">
      <Link href="/">Home</Link> {breadcrumbs?.length && "/"}{" "}
      {breadcrumbs?.map((bc, index) => (
        <>
          <Link href={bc.href}>{bc.label}</Link>
          {index + 1 < breadcrumbs.length && " / "}
        </>
      ))}
    </p>
  );
};
