import { PageContent, PageHeader } from "@/lib/layout";
import { Text } from "@/lib/ui";

export default function AdminCoursesPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ href: "/admin", label: "Admin" }]} />
      <PageContent>
        <div className="px-8">
          <Text className="text-3xl font-semibold">Admin</Text>
        </div>
      </PageContent>
    </>
  );
}
