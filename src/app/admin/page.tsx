import { PageContent, PageHeader } from "@/lib/layout";
import { Text } from "@/lib/ui";

export default function AdminPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ href: "/admin", label: "Admin" }]} />
      <PageContent>
        <div className="space-y-0.5">
          <Text className="text-2xl font-semibold">Admin</Text>
        </div>
        <hr />
      </PageContent>
    </>
  );
}
