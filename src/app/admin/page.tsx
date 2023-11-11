import { PageContent, PageHeader } from "@/lib/layout";

export default function AdminPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ href: "/admin", label: "Admin" }]} />
      <PageContent>
        <h1>Admin</h1>
      </PageContent>
    </>
  );
}
