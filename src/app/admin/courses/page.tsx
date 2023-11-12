import { PageContent, PageHeader } from "@/lib/layout";

export default function AdminPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/courses", label: "Courses" },
        ]}
      />
      <PageContent>
        <h1>Courses</h1>
      </PageContent>
    </>
  );
}
